'use strict';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function () {
    window.app.marker = new Feature({
        geometry: new Point([0, 0])
    });
    window.app.marker.setId('mapper-marker');
    window.app.markerLayer = new VectorLayer({
        source: new VectorSource({
            features: [window.app.marker]
        }),
        visible: false,
        zIndex: Infinity
    });
    window.app.map.addLayer(window.app.markerLayer);

    return window.app.markerLayer;
}
