import displayFeatureInList from '../feature';

function createOlFile(fileType, fileIndex, title) {
    if ($(`#info-layer-${fileType}-${fileIndex}`).length === 0) {
        const ol = document.createElement('ol');

        $(document.createElement('li'))
            .attr('id', `info-layer-${fileType}-${fileIndex}`)
            .append(`<strong>${title}</strong>`)
            .append(ol)
            .appendTo(`#info-list`);

        return ol;
    }

    return $(`#info-layer-${fileType}-${fileIndex} > ol`);
}

export default function (file, feature, featureIndex) {
    let fileIndex = null;
    let fileType = null;

    if (window.app.geojson.indexOf(file) > -1) {
        fileIndex = window.app.geojson.indexOf(file);
        fileType = 'geojson';
    } else if (window.app.kml.indexOf(file) > -1) {
        fileIndex = window.app.kml.indexOf(file);
        fileType = 'kml';
    } else {
        // To Do : error because file was not found
    }

    const title = (file.title !== null ? file.title : file.file.fileName);

    const olFile = createOlFile(fileType, fileIndex, title);

    displayFeatureInList(feature, featureIndex, title, olFile, file.selection);
}
