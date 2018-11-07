import KMLAddFileToMap from './map';
import KMLAddFileToSidebar from './sidebar';

export default function () {
    let names = [];
    $('#modal-layers-files-kml .list-group-item.list-group-item-primary').each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    for (let i = 0; i < window.app.kml.length; i++) {
        if (names.indexOf(window.app.kml[i].file.fileName) > -1) {
            KMLAddFileToMap(i, window.app.kml[i]);
            KMLAddFileToSidebar(i, window.app.kml[i].file);
        }
    }
}
