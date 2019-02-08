'use strict';

import initWMTSAddService from './new';
import WMTS from './wmts';

export default function () {
    window.app.wmts = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
        case 'wmts':
            const wmts = new WMTS(layer.url, (service) => {
                service.displayCapabilities();

                if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                    service.addToMap(layer.layers);
                    service.addToSidebar(layer.layers);
                }
            });
            break;
        }
    }

    initWMTSAddService();
}
