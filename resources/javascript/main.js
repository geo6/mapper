/*global $*/

require('./fontawesome');

import initMap from './map';
import {
    initLayers,
    uploadLayer
} from './map/layers';

window.app = window.app || {};
window.app.fn = {
    initMap: initMap
};

$(document).ready(() => {
    initMap();
    initLayers();
    uploadLayer();
});
