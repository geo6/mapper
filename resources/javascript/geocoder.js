import geocodeAddress from './geocoder/address';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function () {
    window.app.geocoder = new VectorLayer({
        source: new VectorSource(),
        visible: false,
        zIndex: Infinity
    });
    window.app.map.addLayer(window.app.geocoder);

    $('#geocoder-address').on('submit', (event) => {
        event.preventDefault();

        geocodeAddress();
    });
}
