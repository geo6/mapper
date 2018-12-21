import File from '../../file';

export default function () {
    window.app.geojson = [];

    window.app.files.geojson.forEach(file => {
        const geojson = new File('geojson', file.identifier, file.name, file.title, file.description);

        geojson.displayInList();
    });
}
