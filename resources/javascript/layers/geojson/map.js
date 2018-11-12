import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function (index, file) {
    const {
        uniqueIdentifier
    } = file.file;

    window.app.geojson[index].olLayer = new VectorLayer({
        source: new VectorSource({
            url: `/file/${uniqueIdentifier}`,
            format: new GeoJSON()
        })
    });

    window.app.map.addLayer(window.app.geojson[index].olLayer);
}
