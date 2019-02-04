import displayFeatureInList from '../feature';

/**
 * Create ol DOM element for a specific file in the sidebar.
 *
 * @param {string} fileType File type (geojson|kml|gpx).
 * @param {int} fileIndex   File index (in array of its own type).
 * @param {string} title    File title.
 *
 * @returns {object} ol DOM element.
 */
function createOlFile (fileType, fileIndex, title) {
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

/**
 * Generate list with the result of GetFeatureInfo request on a file in the sidebar.
 *
 * @param {object} file      File object.
 * @param {object} feature   Feature to display.
 * @param {int} featureIndex Index of the feature (in result) to display.
 * @returns {void}
 */
export default function (file, feature, featureIndex) {
    let fileIndex = null;
    let fileType = null;

    if (window.app.csv.indexOf(file) > -1) {
        fileIndex = window.app.csv.indexOf(file);
        fileType = 'csv';
    } else if (window.app.geojson.indexOf(file) > -1) {
        fileIndex = window.app.geojson.indexOf(file);
        fileType = 'geojson';
    } else if (window.app.gpx.indexOf(file) > -1) {
        fileIndex = window.app.gpx.indexOf(file);
        fileType = 'gpx';
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
