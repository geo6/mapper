'use strict';

import VectorLayer from 'ol/layer/Vector';

import displayFeatureInList from './info/feature';
import CSVAddFileToMap from './layers/files/csv';
import GeoJSONAddFileToMap from './layers/files/geojson';
import GPXAddFileToMap from './layers/files/gpx';
import KMLAddFileToMap from './layers/files/kml';

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
     */
    constructor (type, identifier, name, title, description) {
        this.type = type;
        this.identifier = identifier;
        this.name = name;
        this.title = title;
        this.description = description;
        this.olLayer = null;
        this.selection = [];

        if (['csv', 'geojson', 'gpx', 'kml'].indexOf(this.type) === -1) {
            throw new Error('Invalid file type.');
        }

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

        $(li)
            .addClass('list-group-item')
            .attr({
                id: `file-${this.type}-${this.getIndex()}`
            })
            .on('click', event => {
                event.stopPropagation();

                $(event.delegateTarget).toggleClass('list-group-item-primary');
            });

        $(document.createElement('div'))
            .append(`<strong>${this.name}</strong>`)
            .appendTo(li);

        if (typeof this.title !== 'undefined') {
            $(document.createElement('div'))
                .text(this.title)
                .appendTo(li);
        }
        if (typeof this.description !== 'undefined') {
            $(document.createElement('p'))
                .addClass('text-info small')
                .text(this.description)
                .appendTo(li);
        }

        if (typeof element !== 'undefined' && $(element).length > 0) {
            $(element).replaceWith(li);
        } else {
            $(`#modal-layers-files-${this.type} > .list-group`).append(li);
        }
    }

    displayInSidebar () {
        const li = $('#layers-new').clone();

        const pointer = $(`#layers .list-group > li[id^="layers-${this.type}-"]`).length;

        $(li)
            .data({
                type: this.type,
                index: this.getIndex(),
                layer: this.name
            })
            .attr({
                id: `layers-${this.type}-${pointer}`
            })
            .show()
            .appendTo('#layers .list-group');

        $(li)
            .find('div.layer-name')
            .addClass('text-nowrap text-truncate')
            .attr({
                title: this.name
            })
            .html(
                '<i class="fas fa-info-circle"></i> ' +
                (this.title || this.name)
            );
    }

    addToMap () {
        let source = null;

        switch (this.type) {
        case 'csv':
            CSVAddFileToMap(this); // async
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
                source: source
            });

            window.app.map.addLayer(this.olLayer);
        }
    }

    removeFromMap () {
        window.app.map.removeLayer(this.olLayer);

        this.olLayer = null;
        this.selection = [];
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

        $(document.createElement('li'))
            .attr('id', `info-layer-${this.type}-${this.getIndex()}`)
            .append(`<strong>${title}</strong>`)
            .append(ol)
            .appendTo(`#info-list`);

        features.forEach((feature) => displayFeatureInList(feature, title, ol));
    }
}

export {
    File
    as
    default
};
