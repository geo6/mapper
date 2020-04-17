'use strict';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

export default function (wms, layers) {
    if (typeof wms !== 'undefined' && layers.length > 0) {
        const names = [];
        for (let i = 0; i < layers.length; i++) {
            names.push(layers[i].Name);
        }

        if (wms.olLayer === null) {
            wms.olLayer = new TileLayer({
                source: new TileWMS({
                    params: {
                        LAYERS: names
                    },
                    url: wms.capabilities.Service.OnlineResource
                })
            });

            window.app.map.addLayer(wms.olLayer);
        } else {
            const params = wms.olLayer.getSource().getParams();
            wms.olLayer.getSource().updateParams({
                LAYERS: params.LAYERS.concat(names)
            });
        }
    }
}
