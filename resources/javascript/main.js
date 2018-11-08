import initMap from './map';
import initLayers from './map/layers';
import initUpload from './upload';

window.app = window.app || {};
window.app.fn = {
    initMap: initMap
};

$(document).ready(() => {
    initMap();
    initLayers();
    initUpload();
});
