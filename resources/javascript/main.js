'use strict';

import Cache from './cache';
import initMap from './map';
import initLayers from './map/layers';
import initUpload from './upload';

window.app = window.app || {};

$(document).ready(() => {
    window.app.cache = new Cache();

    initMap();
    initLayers();
    initUpload();

    $('body').addClass('loaded');
});
