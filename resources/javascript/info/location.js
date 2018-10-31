import {
    toLonLat
} from 'ol/proj';
import {
    toStringXY
} from 'ol/coordinate';

export default function (coordinates) {
    $('#info-location-coordinates').text(toStringXY(toLonLat(coordinates), 6));

    $('.sidebar-tabs > ul > li:has(a[href="#info"])').removeClass('disabled');
    window.app.sidebar.open('info');
}
