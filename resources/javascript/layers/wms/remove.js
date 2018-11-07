export default function () {
    let wms = [];
    for (const i = 0; i < window.app.wms.length; i++) {
        wms[i] = [];
    }

    $('#layers-list > li[id^=layers-wms]:visible').each((i, element) => {
        const {
            index,
            layer
        } = $(element).data();

        wms[index].push(layer);
    });

    for (const i = 0; i < window.app.wms.length; i++) {
        if (wms[i].length === 0 && window.app.wms[i].olLayer !== null) {
            window.app.map.removeLayer(window.app.wms[i].olLayer);
            window.app.wms[i].olLayer = null;
        } else if (wms[i].length > 0) {
            window.app.wms[i].olLayer.getSource().updateParams({
                'LAYERS': wms[i]
            });
        }
    }
}
