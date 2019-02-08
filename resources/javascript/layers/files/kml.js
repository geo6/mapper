'use strict';

import KML from 'ol/format/KML';
import VectorSource from 'ol/source/Vector';

export default function (file) {
    return new VectorSource({
        url: file.url,
        format: new KML()
    });
}
