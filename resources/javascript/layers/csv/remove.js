export default function (index) {
    window.app.map.removeLayer(window.app.csv[index].olLayer);
    window.app.csv[index].olLayer = null;
    window.app.csv[index].selection = [];
}
