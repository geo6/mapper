export default function () {
    let wmts = [];
    for (let i = 0; i < window.app.wmts.length; i++) {
        wmts[i] = [];
    }
    $('#layers-list > li[id^=layers-wmts]:visible').each((i, element) => {
        const {
            index,
            layer
        } = $(element).data();

        wmts[index].push(layer);
    });

    for (let i = 0; i < window.app.wmts.length; i++) {
        Object.keys(window.app.wmts[i].olLayers)
            .forEach((name) => {
                if (wmts[i].indexOf(name) === -1) {
                    window.app.map.removeLayer(window.app.wmts[i].olLayers[name]);
                    delete window.app.wmts[i].olLayers[name];
                }
            });
    }
}
