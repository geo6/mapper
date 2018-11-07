import TileLayer from 'ol/layer/Tile';
import {
    WMTS,
    optionsFromCapabilities
} from 'ol/source/WMTS';

export default function (index, layer) {
    if (typeof window.app.wmts[index] !== 'undefined' && typeof layer === 'object') {
        let service = window.app.wmts[index].capabilities;

        let name = layer.Identifier;

        // To Do: Define what to do with mutlipe layers from same WMTS
        window.app.map.removeLayer(window.app.wmts[index].olLayer);
        window.app.wmts[index].olLayer = null;

        if (window.app.wmts[index].olLayer === null) {
            window.app.wmts[index].olLayer = new TileLayer({
                source: new WMTS(optionsFromCapabilities(service, {
                    layer: name
                }))
            });

            window.app.map.addLayer(window.app.wmts[index].olLayer);
        } else {
            // To Do: Define what to do with mutlipe layers from same WMTS
        }
    }
}
