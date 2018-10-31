import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import {
    fromLonLat
} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style
} from 'ol/style';

export default function () {
    window.app.marker = new Feature({
        geometry: new Point([0, 0])
    });
    window.app.marker.setId('mapper-marker');
    // window.app.marker.setStyle(
    //     new Style({
    //         image: new CircleStyle({
    //             radius: 7,
    //             fill: new Fill({
    //                 color: 'black'
    //             }),
    //             stroke: new Stroke({
    //                 color: 'white',
    //                 width: 2
    //             })
    //         })
    //     })
    // );
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
