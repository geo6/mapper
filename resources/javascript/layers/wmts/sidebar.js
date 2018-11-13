export default function (index, layer) {
    const getfeatureinfo = typeof window.app.wmts[index].capabilities.OperationsMetadata.GetFeatureInfo !== 'undefined';

    let queryable = false;
    if (typeof layer.ResourceURL !== 'undefined') {
        layer.ResourceURL.forEach((resource) => {
            if (resource.resourceType === 'FeatureInfo' && resource.format === 'application/json') {
                queryable = true;

                return false;
            }
        });
    }

    const li = $('#layers-new').clone();

    const name = layer.Name || layer.Identifier;
    const pointer = $(`#layers .list-group > li[id^="layers-wmts-${index}-"]`).length;

    $(li)
        .data({
            type: 'wmts',
            index: index,
            layer: name
        })
        .attr({
            id: `layers-wmts-${index}-${pointer}`
        })
        .show()
        .appendTo('#layers .list-group');

    $(li).find('div.layer-name')
        .addClass('text-nowrap text-truncate')
        .attr({
            title: name
        })
        .html(
            (getfeatureinfo === true && queryable === true ? '<i class="fas fa-info-circle"></i> ' : '') +
            layer.Title
        );

    if (
        typeof layer.Style !== 'undefined' && layer.Style.length > 0 &&
        typeof layer.Style[0].LegendURL !== 'undefined' && layer.Style[0].LegendURL.length > 0
    ) {
        let img = document.createElement('img');

        img.src = layer.Style[0].LegendURL[0].href;
        img.alt = `Legend "${name}"`;

        img.classList.add('img-fluid');

        $(li).find('div.layer-legend').html(img);

        $(li).find('.btn-layer-legend')
            .removeClass('disabled')
            .prop('disabled', false);
    }
}
