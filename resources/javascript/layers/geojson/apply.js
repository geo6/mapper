import GeoJSONAddFileToMap from './map';
import GeoJSONAddFileToSidebar from './sidebar';

export default function () {
    let names = [];
    $('#modal-layers-files-geojson .list-group-item.list-group-item-primary').each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    for (let i = 0; i < window.app.geojson.length; i++) {
        if (names.indexOf(window.app.geojson[i].file.fileName) > -1) {
            GeoJSONAddFileToMap(i, window.app.geojson[i])
                .then(() => {
                    GeoJSONAddFileToSidebar(i, window.app.geojson[i].file);
                });
        }
    }
}
