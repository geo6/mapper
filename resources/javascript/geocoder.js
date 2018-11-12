import geocodeAddress from './geocoder/address';
import geocodeReverse from './geocoder/reverse';

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

    $('#info-location a[href="#reverse-geocode"]').on('click', (event) => {
        event.preventDefault();

        const { longitude, latitude } = $(event.currentTarget).data();

        geocodeReverse(longitude, latitude);

        window.app.sidebar.open('geocoder');
    });
}
