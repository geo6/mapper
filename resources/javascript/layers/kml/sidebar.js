export default function (index, file) {
    const li = $('#layers-new').clone();

    const { fileName } = file;
    const { title } = window.app.kml[index];

    const pointer = $(`#layers .list-group > li[id^="layers-kml-"]`).length;

    $(li)
        .data({
            type: 'kml',
            index: index,
            layer: fileName
        })
        .attr({
            id: `layers-kml-${pointer}`
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
