import CSVAddFileToMap from './map';
import CSVAddFileToSidebar from './sidebar';

export default function () {
    let names = [];
    $('#modal-layers-files-csv .list-group-item.list-group-item-primary').each((index, element) => {
        names.push($(element).data('name'));

        $(element).removeClass('list-group-item-primary');
    });

    for (let i = 0; i < window.app.csv.length; i++) {
        if (names.indexOf(window.app.csv[i].file.fileName) > -1) {
            CSVAddFileToMap(i, window.app.csv[i]);
            CSVAddFileToSidebar(i, window.app.csv[i].file);
        }
    }
}
