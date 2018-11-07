export default function (index) {
    window.app.map.removeLayer(window.app.geojson[index].olLayer);
    window.app.geojson[index].olLayer = null;
    window.app.geojson[index].selection = [];
}
