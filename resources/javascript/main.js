'use strict';

import Cache from './cache';
import initMap from './map';
import initLayers from './map/layers';
import initProj4 from './proj4';
import initUpload from './upload';

window.app = window.app || {};

$(document).ready(() => {
    window.app.cache = new Cache();

    initProj4();

    initMap();
    initLayers();
    initUpload();

    $('body').addClass('loaded');
});
