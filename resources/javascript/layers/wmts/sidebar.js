export default function (id, layers) {
    for (let i = 0; i < layers.length; i++) {
        let li = $('#layers-new').clone();

        let name = layers[i].Name || layers[i].Identifier;

        $(li)
            .data({
                type: 'wmts',
                id: id,
                layer: name
            })
            .attr({
                id: 'layers-wmts-' + id + '-' + i
            })
            .show()
            .appendTo('#layers .list-group');

        $(li)
            .find('div.layer-name')
            .addClass('text-nowrap text-truncate')
            .attr({
                title: name
            })
            .html(
                (layers[i].queryable === true ? '<i class="fas fa-info-circle"></i> ' : '') +
                layers[i].Title
            );

        if (
            typeof layers[i].Style !== 'undefined' && layers[i].Style.length > 0 &&
            typeof layers[i].Style[0].LegendURL !== 'undefined' && layers[i].Style[0].LegendURL.length > 0
        ) {
            let img = document.createElement('img');

            img.src = layers[i].Style[0].LegendURL[0].OnlineResource;
            img.alt = `Legend "${name}"`;

            img.classList.add('img-fluid');

            $(li).find('div.layer-legend').html(img);

            $(li).find('.btn-layer-legend')
                .removeClass('disabled')
                .prop('disabled', false);
        }
    }
}
