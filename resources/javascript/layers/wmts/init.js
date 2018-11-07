import initWMTSAddService from './new';
import WMTSLoadGetCapabilities from './capabilities';
import WMTSAddLayerToMap from './map';
import WMTSAddLayerToSidebar from './sidebar';

export default function () {
    window.app.wmts = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
            case 'wmts':
                WMTSLoadGetCapabilities(layer.url)
                    .then((id) => {
                        if (typeof layer.layer !== 'undefined') {
                            let layers = [];

                            for (let i = 0; i < window.app.wmts[id].layers.length; i++) {
                                if (window.app.wmts[id].layers[i].Identifier === layer.layer) {
                                    layers.push(window.app.wmts[id].layers[i]);
                                    break;
                                }
                            }

                            WMTSAddLayerToMap(id, layers[0]);
                            WMTSAddLayerToSidebar(id, layers);
                        }
                    });
                break;
        }
    }

    initWMTSAddService();
}
