export default function () {
    let wmts = [];
    for (let i = 0; i < window.app.wmts.length; i++) {
        wmts[i] = [];
    }
    $('#layers-list > li[id^=layers-wmts]:visible').each((index, element) => {
        let data = $(element).data();

        wmts[data.id].push(data.layer);
    });

    for (let i = 0; i < window.app.wmts.length; i++) {
        if (wmts[i].length === 0 && window.app.wmts[i].olLayer !== null) {
            window.app.map.removeLayer(window.app.wmts[i].olLayer);
            window.app.wmts[i].olLayer = null;
        } else if (wmts[i].length > 0) {
            // To Do: Define what to do with mutlipe layers from same WMTS
        }
    }
}
