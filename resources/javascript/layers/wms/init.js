import initWMSAddService from './new';

import WMS from './wms';

export default function () {
    window.app.wms = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
        case 'wms':
            const wms = new WMS(layer.url, (service) => {
                service.displayCapabilities();

                if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                    service.addToMap(layer.layers);
                    service.addToSidebar(layer.layers);
                }
            });
            break;
        }
    }

    initWMSAddService();
}
