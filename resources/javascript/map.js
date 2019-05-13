'use strict';

import 'ol/ol.css';
import 'sidebar-v2/css/ol3-sidebar.css';

import {
    Map,
    View
} from 'ol';
import {
    defaults as ControlDefaults,
    Attribution,
    ScaleLine
} from 'ol/control';
import { fromLonLat } from 'ol/proj';

import initDraw from './draw';
import initGeocoder from './geocoder';
import initInfo from './info';
import initBaselayers from './map/baselayers';
import GeolocationControl from './map/geolocation';
import initMarker from './map/marker';
import MeasureControl from './map/measure/control';
import initPermalink from './map/permalink';
import initSingleClick from './map/singleclick';

require('sidebar-v2/js/jquery-sidebar.js');

export default function () {
    $('#map').height($(window).height() - $('body > nav.navbar').outerHeight());
    $(window).on('resize', () => {
        $('#map').height($(window).height() - $('body > nav.navbar').outerHeight());
    });

    window.app.map = new Map({
        target: 'map',
        controls: ControlDefaults({
            attribution: false
        }).extend([
            new Attribution({
                collapsible: false
            }),
            new ScaleLine(),
            new GeolocationControl(),
            new MeasureControl()
        ]),
        layers: [],
        view: new View({
            center: fromLonLat(window.app.center),
            zoom: window.app.zoom
        })
    });
    window.app.map.once('rendercomplete', () => {
        initPermalink();
        initSingleClick();
        initInfo();
        initBaselayers();
        initMarker();
        initGeocoder();
        initDraw();
    });

    window.app.sidebar = $('#sidebar').sidebar();
}
