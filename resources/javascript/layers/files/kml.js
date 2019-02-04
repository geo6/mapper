import KML from 'ol/format/KML';
import VectorSource from 'ol/source/Vector';

export default function (file) {
    const url = window.app.baseUrl + 'file/' + (file.local ? 'local/' : '') + file.identifier + '?' + $.param({ c: window.app.custom });

    return new VectorSource({
        url: url,
        format: new KML()
    });
}
