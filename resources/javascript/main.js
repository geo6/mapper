/*global $*/

require('./fontawesome');

import initMap from './map';
import {
    initLayers,
    uploadLayer
} from './map/layers';
import {
    load as WMSLoad
} from './map/layers/wms';
import {
    load as WMTSLoad
} from './map/layers/wmts';

window.app = window.app || {};
window.app.fn = {
    initMap: initMap
};

$(document).ready(() => {
    initMap();
    initLayers();
    uploadLayer();
});
