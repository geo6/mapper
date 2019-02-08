'use strict';

export default function (service, layer) {
    const li = $('#layers-new').clone();

    const name = layer.Name || layer.Identifier;
    const pointer = $(`#layers .list-group > li[id^="layers-wms-${service.getIndex()}-"]`).length;

    $(li)
        .data({
            type: 'wms',
            index: service.getIndex(),
            layer: name
        })
        .attr({
            id: `layers-wms-${service.getIndex()}-${pointer}`
        })
        .show()
        .appendTo('#layers .list-group');

    let icon = '';
    if (layer.queryable === true) {
        if (service.mixedContent === true) {
            icon = '<i class="fas fa-info-circle text-light" style="cursor:help;" title="GetFeatureInfo is disabled because of Mixed Active Content."></i> ';
        } else {
            icon = '<i class="fas fa-info-circle"></i> ';
        }
    }

    $(li).find('div.layer-name')
        .addClass('text-nowrap text-truncate')
        .attr({
            title: name
        })
        .html(
            icon +
            layer.Title
        );

    if (
        typeof layer.Style !== 'undefined' && layer.Style.length > 0 &&
        typeof layer.Style[0].LegendURL !== 'undefined' && layer.Style[0].LegendURL.length > 0
    ) {
        let img = document.createElement('img');

        img.src = layer.Style[0].LegendURL[0].OnlineResource;
        img.alt = `Legend "${name}"`;

        img.classList.add('img-fluid');

        $(li).find('div.layer-legend').html(img);

        $(li).find('.btn-layer-legend')
            .removeClass('disabled')
            .prop('disabled', false);
    }
}
