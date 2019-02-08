'use strict';

import GPX from 'ol/format/GPX';
import VectorSource from 'ol/source/Vector';

export default function (file) {
    return new VectorSource({
        url: file.url,
        format: new GPX()
    });
}
