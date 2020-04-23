'use strict';

import initWMTSAddService from './new';
import WMTS from './wmts';

import { layers } from '../../main';

export default function () {
    window.app.wmts = [];

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];

        switch (layer.type) {
        case 'wmts': {
            const wmts = new WMTS(layer.url, (service) => {
                service.displayCapabilities();

                if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                    service.addToMap(layer.layers);
                    service.addToSidebar(layer.layers);
                }
            });

            window.app.wmts.push(wmts);
            break;
        }
        }
    }

    initWMTSAddService();
}
