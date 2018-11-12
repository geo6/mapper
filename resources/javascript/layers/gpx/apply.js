import GPXAddFileToMap from './map';
import GPXAddFileToSidebar from './sidebar';

export default function () {
    let names = [];
    $('#modal-layers-files-gpx .list-group-item.list-group-item-primary').each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    for (let i = 0; i < window.app.gpx.length; i++) {
        if (names.indexOf(window.app.gpx[i].file.fileName) > -1) {
            GPXAddFileToMap(i, window.app.gpx[i]);
            GPXAddFileToSidebar(i, window.app.gpx[i].file);
        }
    }
}
