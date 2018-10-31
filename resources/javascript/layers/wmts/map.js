import {
    Tile as TileLayer
} from 'ol/layer';
import {
    WMTS
} from 'ol/source';
import {
    optionsFromCapabilities
} from 'ol/source/WMTS';

export default function (id, layer) {
    if (typeof window.app.wmts[id] !== 'undefined' && typeof layer === 'object') {
        let service = window.app.wmts[id].capabilities;

        let name = layer.Identifier;

        // ToDo: Define what to do with mutlipe layers from same WMTS
        window.app.map.removeLayer(window.app.wmts[id].olLayer);
        window.app.wmts[id].olLayer = null;

        if (window.app.wmts[id].olLayer === null) {
            window.app.wmts[id].olLayer = new TileLayer({
                source: new WMTS(optionsFromCapabilities(service, {
                    layer: name
                }))
            });

            window.app.map.addLayer(window.app.wmts[id].olLayer);
        } else {
            // ToDo: Define what to do with mutlipe layers from same WMTS
        }
    }
}
