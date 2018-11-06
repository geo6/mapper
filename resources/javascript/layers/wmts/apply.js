import WMTSAddLayerToMap from './map';
import WMTSAddLayerToSidebar from './sidebar';

export default function (index) {
    let names = [];
    $('#modal-layers-layers .list-group-item.list-group-item-primary').each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    let layers = [];
    for (let i = 0; i < window.app.wmts[index].layers.length; i++) {
        if (names.indexOf(window.app.wmts[index].layers[i].Identifier) > -1) {
            layers.push(window.app.wmts[index].layers[i]);
        }
    }

    // ToDo: Define what to do with mutlipe layers from same WMTS

    WMTSAddLayerToMap(index, layers[0]);
    WMTSAddLayerToSidebar(index, layers);
}
