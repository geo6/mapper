import TileLayer from 'ol/layer/Tile';
import WMTS, {
    optionsFromCapabilities
} from 'ol/source/WMTS';

export default function (index, layer) {
    if (typeof window.app.wmts[index] !== 'undefined' && typeof layer === 'object') {
        let service = window.app.wmts[index].capabilities;

        let name = layer.Identifier;

        if (typeof window.app.wmts[index].olLayers[name] === 'undefined') {
            window.app.wmts[index].olLayers[name] = new TileLayer({
                source: new WMTS(optionsFromCapabilities(service, {
                    layer: name,
                    projection: window.app.map.getView().getProjection()
                }))
            });
            window.app.map.addLayer(window.app.wmts[index].olLayers[name]);
        }

        console.log(window.app.wmts[index].olLayers);
    }
}
