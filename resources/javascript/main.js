/*global $*/

require('./fontawesome');

import initMap from './map';
import initLayers from './map/layers';
import uploadLayer from './upload';

window.app = window.app || {};
window.app.fn = {
    initMap: initMap
};

$(document).ready(() => {
    initMap();
    initLayers();
    uploadLayer();
});
