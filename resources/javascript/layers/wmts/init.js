'use strict';

import initWMTSAddService from './new';
import WMTS from './wmts';

export default function (layers) {
    window.app.wmts = [];

    layers.forEach((layer) => {
        const wmts = new WMTS(layer.url, (service) => {
            service.displayCapabilities();

            if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                service.addToMap(layer.layers);
                service.addToSidebar(layer.layers);
            }
        });

        window.app.wmts.push(wmts);
    });

    initWMTSAddService();
}
