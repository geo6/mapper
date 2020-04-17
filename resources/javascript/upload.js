'use strict';

import Resumable from 'resumablejs/resumable';

import File from './file';

export default function () {
    const resumable = new Resumable({
        fileType: [
            'csv',
            'geojson',
            'gpx',
            'json',
            'kml'
        ],
        target: `${window.app.baseUrl}upload`
    });

    resumable.assignBrowse(document.getElementById('btn-layers-upload'));

    resumable.on('filesAdded', (files, skipped) => {
        $('#progress-upload > .progress-bar')
            .attr('aria-valuenow', 0)
            .css('width', '0%');

        const count = {
            csv: 0,
            geojson: 0,
            gpx: 0,
            kml: 0
        };

        files.forEach(file => {
            const extension = file.fileName.substring(file.fileName.lastIndexOf('.') + 1, file.fileName.length) || file.name;

            const li = document.createElement('li');
            $(li)
                .addClass('list-group-item')
                .css({
                    opacity: 0.33
                })
                .data({
                    identifier: file.uniqueIdentifier
                });

            $(document.createElement('div'))
                .append(`<strong>${file.fileName}</strong>`)
                .appendTo(li);

            switch (extension.toLowerCase()) {
            case 'csv': {
                count.csv++;

                const pointerCSV = $('#modal-layers-files-csv > .list-group > .list-group-item').length;
                $(li).attr({ id: `file-csv-${pointerCSV}` });

                $('#modal-layers-files-csv > .list-group').append(li);
                break;
            }
            case 'json':
            case 'geojson': {
                count.geojson++;

                const pointerGeoJSON = $('#modal-layers-files-geojson > .list-group > .list-group-item').length;
                $(li).attr({ id: `file-geojson-${pointerGeoJSON}` });

                $('#modal-layers-files-geojson > .list-group').append(li);
                break;
            }
            case 'gpx': {
                count.gpx++;

                const pointerGPX = $('#modal-layers-files-gpx > .list-group > .list-group-item').length;
                $(li).attr({ id: `file-gpx-${pointerGPX}` });

                $('#modal-layers-files-gpx > .list-group').append(li);
                break;
            }
            case 'kml': {
                count.kml++;

                const pointerKML = $('#modal-layers-files-kml > .list-group > .list-group-item').length;
                $(li).attr({ id: `file-kml-${pointerKML}` });

                $('#modal-layers-files-kml > .list-group').append(li);
                break;
            }
            }
        });

        if (Math.max(...Object.values(count)) === count.geojson) {
            $('#modal-layers-select')
                .val('geojson')
                .trigger('change');
        } else if (Math.max(...Object.values(count)) === count.csv) {
            $('#modal-layers-select')
                .val('csv')
                .trigger('change');
        } else if (Math.max(...Object.values(count)) === count.gpx) {
            $('#modal-layers-select')
                .val('gpx')
                .trigger('change');
        } else if (Math.max(...Object.values(count)) === count.kml) {
            $('#modal-layers-select')
                .val('kml')
                .trigger('change');
        }

        resumable.upload();
    });

    resumable.on('progress', () => {
        const pct = Math.round(resumable.progress(true) * 100);

        $('#progress-upload > .progress-bar')
            .attr('aria-valuenow', pct)
            .css('width', `${pct}%`);
    });

    resumable.on('fileSuccess', (file, message) => {
        const extension = file.fileName.substring(file.fileName.lastIndexOf('.') + 1, file.fileName.length) || file.name;
        const {
            title,
            description
        } = JSON.parse(message);

        let f = null;
        switch (extension.toLowerCase()) {
        case 'csv':
            f = new File('csv', file.uniqueIdentifier, file.fileName, title, description);
            break;
        case 'json':
        case 'geojson':
            f = new File('geojson', file.uniqueIdentifier, file.fileName, title, description);
            fetch(f.url)
                .then(response => response.json())
                .then(json => {
                    f.content = json;
                });
            break;
        case 'gpx':
            f = new File('gpx', file.uniqueIdentifier, file.fileName, title, description);
            break;
        case 'kml':
            f = new File('kml', file.uniqueIdentifier, file.fileName, title, description);
            break;
        }

        if (f instanceof File) {
            const li = $(`#file-${f.type}-${f.getIndex()}`);

            f.displayInList(li);
        }
    });
}
