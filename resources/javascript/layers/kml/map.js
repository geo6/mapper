import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function (index, file) {
    const {
        uniqueIdentifier
    } = file.file;

    window.app.kml[index].olLayer = new VectorLayer({
        source: new VectorSource({
            url: `/file/${uniqueIdentifier}`,
            format: new KML()
        })
    });

    window.app.map.addLayer(window.app.kml[index].olLayer);
}
