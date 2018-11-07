import WMSAddLayersToMap from './map';
import WMSAddLayerToSidebar from './sidebar';

export default function (index) {
    let names = [];
    $(`#modal-layers-services-wms-${index} .list-group-item.list-group-item-primary`).each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    let layers = [];
    for (let i = 0; i < window.app.wms[index].layers.length; i++) {
        if (names.indexOf(window.app.wms[index].layers[i].Name) > -1) {
            layers.push(window.app.wms[index].layers[i]);

            WMSAddLayerToSidebar(index, window.app.wms[index].layers[i]);
        }
    }

    WMSAddLayersToMap(index, layers);
}
