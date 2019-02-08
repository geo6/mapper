'use strict';

import initMap from './map';
import initLayers from './map/layers';
import initUpload from './upload';

window.app = window.app || {};

$(document).ready(() => {
    initMap();
    initLayers();
    initUpload();

    $('body').addClass('loaded');
});
