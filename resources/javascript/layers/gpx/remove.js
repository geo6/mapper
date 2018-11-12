export default function (index) {
    window.app.map.removeLayer(window.app.gpx[index].olLayer);
    window.app.gpx[index].olLayer = null;
    window.app.gpx[index].selection = [];
}
