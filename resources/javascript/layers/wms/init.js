import initWMSAddService from './new';
import WMSLoadGetCapabilities from './capabilities';
import WMSAddLayersToMap from './map';
import WMSAddLayerToSidebar from './sidebar';

export default function () {
    window.app.wms = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
        case 'wms':
            WMSLoadGetCapabilities(layer.url)
                .then((index) => {
                    if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                        let layers = [];

                        for (let i = 0; i < window.app.wms[index].layers.length; i++) {
                            if (layer.layers.indexOf(window.app.wms[index].layers[i].Name) > -1) {
                                layers.push(window.app.wms[index].layers[i]);

                                WMSAddLayerToSidebar(index, window.app.wms[index].layers[i]);
                            }
                        }

                        WMSAddLayersToMap(index, layers);
                    }
                });
            break;
        }
    }

    initWMSAddService();
}
