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

import initBaselayers from './map/baselayers';
import GeolocationControl from './map/geolocation';
import initMarker from './map/marker';
import initPermalink from './map/permalink';
import initSingleClick from './map/singleclick';
import initInfo from './info';

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
            new GeolocationControl()
        ]),
        layers: [],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    });
    window.app.map.once('rendercomplete', () => {
        initPermalink();
        initSingleClick();
        initInfo();
        initBaselayers();
        initMarker();
    });

    window.app.sidebar = $('#sidebar').sidebar();
}
