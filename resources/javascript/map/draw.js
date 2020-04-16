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
                const type = feature.getGeometry().getType();
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
        window.app.map.addLayer(this.layer);

        this.modify = new Modify({
            source: this.layer.getSource()
        });
    }

    enable () {
        document.querySelector(`#draw button.list-group-item-action[data-type="${this.type}"]`).classList.add('active');

        window.app.map.addInteraction(this.modify);

        switch (this.type) {
        case 'point':
            this.draw = new DrawPoint();
            break;
        case 'linestring':
            this.draw = new DrawLineString();
            break;
        case 'polygon':
            this.draw = new DrawPolygon();
            break;
        }
        window.app.map.addInteraction(this.draw);

        this.snap = new Snap({
            source: this.layer.getSource()
        });
        window.app.map.addInteraction(this.snap);
    }

    disable () {
        this.saveLocalStorage();

        if (this.type !== null) {
            document.querySelector(`#draw button.list-group-item-action[data-type="${this.type}"]`).classList.remove('active');
        }

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
