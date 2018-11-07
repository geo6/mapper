export default function (index, layer) {
    const li = $('#layers-new').clone();

    const name = layer.Name || layer.Identifier;
    const pointer = $(`#layers .list-group > li[id^="layers-wms-${index}-"]`).length;

    $(li)
        .data({
            type: 'wms',
            id: index,
            layer: name
        })
        .attr({
            id: `layers-wms-${index}-${pointer}`
        })
        .show()
        .appendTo('#layers .list-group');

    $(li).find('div.layer-name')
        .addClass('text-nowrap text-truncate')
        .attr({
            title: name
        })
        .html(
            (layer.queryable === true ? '<i class="fas fa-info-circle"></i> ' : '') +
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
