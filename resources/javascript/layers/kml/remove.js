export default function (index) {
    window.app.map.removeLayer(window.app.kml[index].olLayer);
    window.app.kml[index].olLayer = null;
    window.app.kml[index].selection = [];
}
