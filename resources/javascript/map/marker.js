'use strict';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle, Fill, Stroke } from 'ol/style';

export default function () {
    var fill = new Fill({
        color: 'rgba(255,0,0,0.1)'
    });
    var stroke = new Stroke({
        color: 'red',
        width: 5
    });

    window.app.marker = new Feature({
        geometry: new Point([0, 0])
    });
    window.app.marker.setId('mapper-marker');
    window.app.markerLayer = new VectorLayer({
        source: new VectorSource({
            features: [window.app.marker]
        }),
        style: [
            new Style({
                image: new Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 5
                }),
                fill: fill,
                stroke: stroke
            })
        ],
        visible: false,
        zIndex: Infinity
    });
    window.app.map.addLayer(window.app.markerLayer);

    return window.app.markerLayer;
}
