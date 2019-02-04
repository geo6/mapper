import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';

export default function (file) {
    return new VectorSource({
        url: `${window.app.baseUrl}file/${file.identifier}`,
        format: new GeoJSON()
    });
}
