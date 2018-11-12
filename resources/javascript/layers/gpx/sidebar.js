export default function (index, file) {
    const li = $('#layers-new').clone();

    const { fileName } = file;
    const { title } = window.app.gpx[index];

    const pointer = $(`#layers .list-group > li[id^="layers-gpx-"]`).length;

    $(li)
        .data({
            type: 'gpx',
            index: index,
            layer: fileName
        })
        .attr({
            id: `layers-gpx-${pointer}`
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
