import {
    toLonLat
} from 'ol/proj';
import {
    toStringXY
} from 'ol/coordinate';

export default function (coordinates) {
    const lonlat = toLonLat(coordinates);

    $('#info-location-coordinates').text(toStringXY(lonlat, 6));

    $('#info-location a[href="#reverse-geocode"]').data({
        longitude: lonlat[0],
        latitude: lonlat[1]
    });

    $('.sidebar-tabs > ul > li:has(a[href="#info"])').removeClass('disabled');
    window.app.sidebar.open('info');
}
