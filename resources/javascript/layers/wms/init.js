import initWMSAddService from './add';
import WMSLoadGetCapabilities from './capabilities';
import WMSAddLayerToMap from './map';
import WMSAddLayerToSidebar from './sidebar';

export default function () {
    window.app.wms = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
            case 'wms':
                WMSLoadGetCapabilities(layer.url)
                    .then((id) => {
                        if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                            let layers = [];

                            for (let i = 0; i < window.app.wms[id].layers.length; i++) {
                                if (layer.layers.indexOf(window.app.wms[id].layers[i].Name) > -1) {
                                    layers.push(window.app.wms[id].layers[i]);
                                }
                            }

                            WMSAddLayerToMap(id, layers);
                            WMSAddLayerToSidebar(id, layers);
                        }
                    });
                break;
        }
    }

    initWMSAddService();
}
