'use strict';

import {
    Modify,
    Snap
} from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';

import saveAs from 'file-saver';

import DrawPoint from './draw/point';
import DrawLineString from './draw/linestring';
import DrawPolygon from './draw/polygon';
import Feature from 'ol/Feature';
import MultiPoint from 'ol/geom/MultiPoint';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';

class DrawControl {
    constructor () {
        this.active = false;
        this.type = null;

        if (window.app.custom !== null) {
            this.storageKey = `mapper.${window.app.custom}.draw`;
        } else {
            this.storageKey = 'mapper.draw';
        }

        const storage = localStorage.getItem(this.storageKey);
        let features = [];
        if (storage !== null) {
            features = (new GeoJSON()).readFeatures(storage, {
                featureProjection: window.app.map.getView().getProjection()
            });
            features.forEach((feature) => {
                const type = feature.getId().substring(0, feature.getId().indexOf('-'));
                const count = parseInt(document.getElementById(`draw-count-${type.toLowerCase()}`).innerText);
                document.getElementById(`draw-count-${type.toLowerCase()}`).innerText = `${count + 1}`;
            });

            if (features.length > 0) {
                document.getElementById('btn-draw-clear').disabled = false;
                document.getElementById('btn-draw-export').disabled = false;
            }
        }

        this.layer = new VectorLayer({
            source: new VectorSource({
                features: features
            }),
            // style: new Style({
            //     fill: new Fill({
            //         color: 'rgba(255, 255, 255, 0.2)'
            //     }),
            //     stroke: new Stroke({
            //         color: '#ffcc33',
            //         width: 2
            //     }),
            //     image: new CircleStyle({
            //         radius: 7,
            //         fill: new Fill({
            //             color: '#ffcc33'
            //         })
            //     })
            // }),
            zIndex: Infinity
        });
        window.app.map.addLayer(this.layer);

        this.layerCurrent = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            zIndex: Infinity
        });

        this.modify = new Modify({
            source: this.layerCurrent.getSource()
        });
    }

    enable () {
        document.querySelector(`#draw button.list-group-item-action[data-type="${this.type}"]`).classList.add('active');

        window.app.map.addInteraction(this.modify);

        switch (this.type) {
        case 'point':
            this.draw = new DrawPoint(this);
            break;
        case 'linestring':
            this.draw = new DrawLineString(this);
            break;
        case 'polygon':
            this.draw = new DrawPolygon(this);
            break;
        }
        window.app.map.addInteraction(this.draw);

        window.app.map.addLayer(this.layerCurrent);

        this.snap = new Snap({
            source: this.layer.getSource()
        });
        window.app.map.addInteraction(this.snap);
    }

    disable () {
        document.getElementById('btn-draw-properties').reset();

        if (this.type !== null) {
            document.querySelector(`#draw button.list-group-item-action[data-type="${this.type}"]`).classList.remove('active');
        }

        window.app.map.removeLayer(this.layerCurrent);

        if (this.snap !== null) {
            window.app.map.removeInteraction(this.snap);
            this.snap = null;
        }
        if (this.draw !== null) {
            window.app.map.removeInteraction(this.draw);
            this.draw = null;
        }

        window.app.map.removeInteraction(this.modify);
    }

    clear () {
        document.getElementById('btn-draw-clear').disabled = true;
        document.getElementById('btn-draw-export').disabled = true;

        document.querySelectorAll('.draw-count').forEach(element => { element.innerText = '0'; });

        this.layer.getSource().clear();

        this.clearLocalStorage();
    }

    showForm () {
        document.getElementById('btn-draw-properties').hidden = false;
    }

    resetForm () {
        document.getElementById('btn-draw-properties').hidden = true;

        this.layerCurrent.getSource().clear();
    }

    submitForm () {
        const name = document.querySelector('form#btn-draw-properties input[name="name"]').value;
        const description = document.querySelector('form#btn-draw-properties textarea[name="description"]').value;

        const features = this.layerCurrent.getSource().getFeatures();
        const feature = new Feature();

        const count = parseInt(document.getElementById(`draw-count-${this.type}`).innerText);

        feature.setId(`${this.type}-${count + 1}`);
        feature.setProperties({ name, description });

        if (features.length === 1) {
            feature.setGeometry(features[0].getGeometry());
        } else {
            const coordinates = features.map(feature => feature.getGeometry().getCoordinates());

            switch (this.type) {
            case 'point':
                feature.setGeometry(new MultiPoint(coordinates));
                break;
            case 'linestring':
                feature.setGeometry(new MultiLineString(coordinates));
                break;
            case 'polygon':
                feature.setGeometry(new MultiPolygon(coordinates));
                break;
            }
        }

        this.layer.getSource().addFeature(feature);
        this.snap.addFeature(feature);

        this.saveLocalStorage();

        document.getElementById('btn-draw-clear').disabled = false;
        document.getElementById('btn-draw-export').disabled = false;

        document.getElementById('btn-draw-properties').reset();

        document.getElementById(`draw-count-${this.type}`).innerText = `${count + 1}`;
    }

    saveLocalStorage () {
        localStorage.setItem(this.storageKey, this.toGeoJSON());
    }

    clearLocalStorage () {
        localStorage.removeItem(this.storageKey);
    }

    export () {
        const blob = new Blob([this.toGeoJSON()], {
            type: 'application/json'
        });

        if (window.app.custom !== null) {
            saveAs(blob, `mapper-${window.app.custom}.json`);
        } else {
            saveAs(blob, 'mapper.json');
        }
    }

    toGeoJSON () {
        const features = this.layer.getSource().getFeatures();
        const geojson = (new GeoJSON()).writeFeatures(features, {
            dataProjection: 'EPSG:4326',
            decimals: 6,
            featureProjection: window.app.map.getView().getProjection()
        });

        return geojson;
    }
}

export { DrawControl as default };
