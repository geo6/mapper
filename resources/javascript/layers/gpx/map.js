import GPX from 'ol/format/GPX';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function (index, file) {
    const {
        uniqueIdentifier
    } = file.file;

    window.app.gpx[index].olLayer = new VectorLayer({
        source: new VectorSource({
            url: `/file/${uniqueIdentifier}`,
            format: new GPX()
        })
    });

    window.app.map.addLayer(window.app.gpx[index].olLayer);
}
