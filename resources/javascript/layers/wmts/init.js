import initWMTSAddService from './new';
import WMTSLoadGetCapabilities from './capabilities';
import WMTSAddLayersToMap from './map';
import WMTSAddLayerToSidebar from './sidebar';

export default function () {
    window.app.wmts = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
            case 'wmts':
                WMTSLoadGetCapabilities(layer.url)
                    .then((index) => {
                        if (typeof layer.layer !== 'undefined') {
                            let layers = [];

                            for (let i = 0; i < window.app.wmts[index].layers.length; i++) {
                                if (window.app.wmts[index].layers[i].Identifier === layer.layer) {
                                    layers.push(window.app.wmts[index].layers[i]);

                                    WMTSAddLayerToSidebar(index, window.app.wmts[index].layers[i]);
                                    break;
                                }
                            }

                            // To Do: Define what to do with mutlipe layers from same WMTS

                            WMTSAddLayersToMap(index, layers[0]);
                        }
                    });
                break;
        }
    }

    initWMTSAddService();
}
