'use strict';

import 'ol/ol.css';
import 'sidebar-v2/css/ol3-sidebar.css';

import '../sass/style.scss';

import Cache from './cache';
import initMap from './map';
import initLayers from './map/layers';
import initProj4 from './proj4';
import initUpload from './upload';

window.app = window.app || {};

export function init () {
    window.app.cache = new Cache();

    initProj4();

    initMap();
    initLayers();
    initUpload();

    $('body').addClass('loaded');
}
