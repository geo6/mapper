export default function (index, file) {
    const li = $('#layers-new').clone();

    const { fileName } = file;

    const pointer = $(`#layers .list-group > li[id^="layers-csv-"]`).length;

    $(li)
        .data({
            type: 'csv',
            index: index,
            layer: fileName
        })
        .attr({
            id: `layers-csv-${pointer}`
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
            fileName
        );
}
