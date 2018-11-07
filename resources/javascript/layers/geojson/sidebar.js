export default function (index, file) {
    const li = $('#layers-new').clone();

    const { fileName } = file;
    const { title } = window.app.geojson[index];

    const pointer = $(`#layers .list-group > li[id^="layers-geojson-"]`).length;

    $(li)
        .data({
            type: 'geojson',
            index: index,
            layer: fileName
        })
        .attr({
            id: `layers-geojson-${pointer}`
        })
        .show()
        .appendTo('#layers .list-group');

    $(li)
        .find('div.layer-name')
        .addClass('text-nowrap text-truncate')
        .attr({
            title: fileName
        })
        .html(
            '<i class="fas fa-info-circle"></i> ' +
            (title !== null ? title : fileName)
        );
}
