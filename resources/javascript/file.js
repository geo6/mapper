'use strict';

import VectorLayer from 'ol/layer/Vector';

import displayFeatureInList from './info/feature';
import CSVAddFileToMap from './layers/files/csv';
import {
    add as GeoJSONAddFileToMap,
    legend as GeoJSONLegend
} from './layers/files/geojson';
import GPXAddFileToMap from './layers/files/gpx';
import KMLAddFileToMap from './layers/files/kml';
import layerStyleFunction from './map/style';

/**
 *
 */
class File {
    /**
     *
     * @param {String} type File type (csv|geojson|gpx|kml).
     * @param {String} identifier File unique identifier.
     * @param {String} name File name.
     * @param {String} title File title.
     * @param {String} description File description.
     * @param {bool}   local Is the file stored initially on the server.
     */
    constructor (type, identifier, name, title, description, local) {
        this.type = type;
        this.identifier = identifier;
        this.name = name;
        this.title = title;
        this.description = description;
        this.olLayer = null;
        this.selection = [];
        this.local = local || false;
        this.content = null;

        if (['csv', 'geojson', 'gpx', 'kml'].indexOf(this.type) === -1) {
            throw new Error('Invalid file type.');
        }

        this.url = window.app.baseUrl + 'file/' + (this.local ? 'local/' : '') + this.identifier + '?' + new URLSearchParams({
            c: window.app.custom
        }).toString();

        window.app[this.type].push(this);
    }

    /**
     * @returns {Number} File index in `window.app[type]` array.
     */
    getIndex () {
        return window.app[this.type].indexOf(this);
    }

    /**
     * @param {object} element DOM element to replace (used by upload).
     *
     * @returns {void}
     */
    displayInList (element) {
        const li = document.createElement('li');
        li.id = `file-${this.type}-${this.getIndex()}`;
        li.className = 'list-group-item';
        li.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            event.currentTarget.classList.toggle('list-group-item-primary');
        });

        if (this.type === 'csv') {
            const select = document.createElement('select');
            select.className = 'float-right form-control form-control-sm d-inline-block w-auto';
            select.innerHTML = '<option value="EPSG:4326">WGS 84 (EPSG:4326)</option>';
            select.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            li.append(select);

            for (const epsg in window.app.epsg) {
                select.innerHTML += `<option value="${epsg}">${window.app.epsg[epsg].name} (${epsg})</option>`;
            }

            li.innerHTML += `<strong style="line-height: calc(1.8125rem + 2px);">${this.name}</strong><br>`;
        } else {
            li.innerHTML = `<strong>${this.name}</strong><br>`;
        }

        if (this.title !== null) {
            li.innerHTML += this.title;
        }
        if (this.description !== null) {
            const p = document.createElement('p');
            p.className = 'text-info small';
            p.innerText = this.description;

            li.append(p);
        }

        if (typeof element !== 'undefined') {
            console.log(element, element.parentElement);
            element.parentElement.replaceChild(li, element);
        } else {
            document.querySelector(`#modal-layers-files-${this.type} > .list-group`).append(li);
        }
    }

    displayInSidebar () {
        const pointer = document.querySelectorAll(`#layers .list-group > li[id^="layers-${this.type}-"]`).length;

        const li = document.getElementById('layers-new').cloneNode(true);
        li.id = `layers-${this.type}-${pointer}`;
        li.hidden = false;
        li.dataset.index = this.getIndex();
        li.dataset.layer = this.name;
        li.dataset.type = this.type;

        const divName = li.querySelector('div.layer-name');
        divName.className = 'text-nowrap text-truncate';
        divName.title = this.name;
        divName.innerHTML = '<i class="fas fa-info-circle"></i> ' + (this.title || this.name);

        const btnZoom = li.querySelector('.btn-layer-zoom');
        btnZoom.classList.remove('disabled');
        btnZoom.disabled = false;

        const btnSettings = li.querySelector('.btn-layer-settings');
        btnSettings.classList.remove('disabled');
        btnSettings.disabled = false;

        document.querySelector('#layers .list-group').append(li);

        if (this.type === 'geojson') {
            if (typeof this.content.legend === 'object' && Array.isArray(this.content.legend)) {
                const canvas = GeoJSONLegend(this.content.legend);

                const divLegend = li.querySelector('div.layer-legend');
                divLegend.append(canvas);

                const btnLegend = li.querySelector('.btn-layer-legend');
                btnLegend.classList.remove('disabled');
                btnLegend.disabled = false;
            }
        }
    }

    addToMap (projection) {
        let source = null;
        switch (this.type) {
        case 'csv':
            CSVAddFileToMap(this, projection); // async
            break;
        case 'geojson':
            source = GeoJSONAddFileToMap(this);
            break;
        case 'gpx':
            source = GPXAddFileToMap(this);
            break;
        case 'kml':
            source = KMLAddFileToMap(this);
            break;
        }

        if (source !== null) {
            this.olLayer = new VectorLayer({
                source: source,
                style: (feature, resolution) => layerStyleFunction(feature, resolution)
            });

            window.app.map.addLayer(this.olLayer);
        }
    }

    removeFromMap () {
        window.app.map.removeLayer(this.olLayer);

        this.olLayer = null;
        this.selection = [];
    }

    zoom () {
        const extent = this.olLayer.getSource().getExtent();

        window.app.map.getView().fit(extent, {
            maxZoom: 18,
            padding: [15, 15, 15, 15]
        });

        window.app.sidebar.close();
    }

    getFeatureInfo (coordinates) {
        const pixel = window.app.map.getPixelFromCoordinate(coordinates);

        if (this.olLayer === null) {
            return [];
        }

        return window.app.map.getFeaturesAtPixel(pixel, {
            // hitTolerance: 10,
            layerFilter: (layer) => {
                return layer === this.olLayer;
            }
        });
    }

    /**
     * Generate list with the result of GetFeatureInfo request on a file in the sidebar.
     *
     * @param {Feature[]} features Feature to display.
     *
     * @returns {void}
     */
    displayFeaturesList (features) {
        const title = this.title || this.name;

        const ol = document.createElement('ol');

        const li = document.createElement('li');
        li.id = `info-layer-${this.type}-${this.getIndex()}`;
        li.innerHTML = `<strong>${title}</strong>`;

        li.append(ol);

        document.getElementById('info-list').append(li);

        features.forEach((feature) => displayFeatureInList(feature, title, ol));
    }
}

export { File as default };
