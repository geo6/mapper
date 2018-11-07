import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default function (index, file) {
    const {
        uniqueIdentifier
    } = file.file;

    return fetch(`/file/${uniqueIdentifier}`)
        .then(response => response.json())
        .then((json) => {
            window.app.geojson[index].olLayer = new VectorLayer({
                source: new VectorSource({
                    features: (new GeoJSON()).readFeatures(json, {
                        featureProjection: window.app.map.getView().getProjection()
                    })
                })
            });

            window.app.map.addLayer(window.app.geojson[index].olLayer);
        });
}
