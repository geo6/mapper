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
                .then((index) => {
                    if (typeof layer.layers !== 'undefined') {
                        for (let i = 0; i < window.app.wmts[index].layers.length; i++) {
                            if (layer.layers.indexOf(window.app.wmts[index].layers[i].Identifier) > -1) {
                                WMTSAddLayerToSidebar(index, window.app.wmts[index].layers[i]);
                                WMTSAddLayerToMap(index, window.app.wmts[index].layers[i]);
                            }
                        }
                    }
                });
            break;
        }
    }

    initWMTSAddService();
}
