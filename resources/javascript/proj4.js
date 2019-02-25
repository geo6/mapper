'use strict';

import { register } from 'ol/proj/proj4';

import proj4 from 'proj4';

export default function () {
    for (const epsg in window.app.epsg) {
        proj4.defs(epsg, window.app.epsg[epsg].proj4);
    }

    register(proj4);
}
