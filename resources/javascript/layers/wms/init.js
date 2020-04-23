'use strict';

import initWMSAddService from './new';
import WMS from './wms';

import { layers } from '../../main';

export default function () {
    window.app.wms = [];

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];

        switch (layer.type) {
        case 'wms': {
            const wms = new WMS(layer.url, (service) => {
                service.displayCapabilities();

                if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                    service.addToMap(layer.layers);
                    service.addToSidebar(layer.layers);
                }
            });

            window.app.wms.push(wms);
            break;
        }
        }
    }

    initWMSAddService();
}
