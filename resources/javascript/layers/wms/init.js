'use strict';

import initWMSAddService from './new';
import WMS from './wms';

export default function (layers) {
    window.app.wms = [];

    layers.forEach((layer) => {
        const wms = new WMS(layer.url, (service) => {
            service.displayCapabilities();

            if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                service.addToMap(layer.layers);
                service.addToSidebar(layer.layers);
            }
        });

        window.app.wms.push(wms);
    });

    initWMSAddService();
}
