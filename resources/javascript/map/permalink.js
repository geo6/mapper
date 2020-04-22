'use strict';

import {
    fromLonLat,
    toLonLat
} from 'ol/proj';

import { cache } from '../main';

export default function () {
    var zoom = 2;
    var center = [0, 0];

    var view = window.app.map.getView();

    if (window.location.hash !== '') {
        // try to restore center, zoom-level and rotation from the URL
        const hash = window.location.hash.replace('#map=', '');
        const parts = hash.split('/');

        if (parts.length === 3) {
            zoom = parseInt(parts[0], 10);
            center = fromLonLat([
                parseFloat(parts[2]),
                parseFloat(parts[1])
            ]);

            window.app.map.getView().setCenter(center);
            window.app.map.getView().setZoom(zoom);
        }
    } else if (typeof cache.map !== 'undefined' && cache.map !== null) {
        zoom = parseInt(cache.map.zoom, 10);
        center = fromLonLat([
            parseFloat(cache.map.longitude),
            parseFloat(cache.map.latitude)
        ]);

        window.app.map.getView().setCenter(center);
        window.app.map.getView().setZoom(zoom);
    }

    var shouldUpdate = true;

    window.app.map.on('moveend', () => {
        if (!shouldUpdate) {
            // do not update the URL when the view was changed in the 'popstate' handler
            shouldUpdate = true;
            return;
        }

        const center = toLonLat(view.getCenter());
        const longitude = Math.round(center[0] * 1000000) / 1000000;
        const latitude = Math.round(center[1] * 1000000) / 1000000;
        const zoom = view.getZoom();

        const hash = `#map=${zoom}/${latitude}/${longitude}`;
        const state = {
            zoom: view.getZoom(),
            center: view.getCenter()
        };

        cache.setMap(zoom, longitude, latitude);

        window.history.pushState(state, 'map', hash);
    });

    // restore the view state when navigating through the history, see
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
    window.addEventListener('popstate', (event) => {
        if (event.state === null) {
            return;
        }

        window.app.map.getView().setCenter(event.state.center);
        window.app.map.getView().setZoom(event.state.zoom);

        shouldUpdate = false;
    });
}
