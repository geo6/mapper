import Resumable from 'resumablejs/resumable';

export default function () {
    const resumable = new Resumable({
        fileType: [
            'json',
            'geojson',
            'gpx',
            'kml'
        ],
        target: `${window.app.baseUrl}upload`
    });

    resumable.assignBrowse(document.getElementById('btn-layers-upload'));

    resumable.on('filesAdded', (files, skipped) => {
        $('#progress-upload > .progress-bar')
            .attr('aria-valuenow', 0)
            .css('width', '0%');

        let count = {
            geojson: 0,
            gpx: 0,
            kml: 0
        };

        files.forEach(file => {
            const pointer = $('#modal-layers-files-geojson > .list-group > .list-group-item').length;
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
            case 'json':
            case 'geojson':
                count.geojson++;

                $(li)
                    .attr({
                        id: `geojson-${pointer}`
                    })
                    .data({
                        name: file.fileName
                    });

                $('#modal-layers-files-geojson > .list-group').append(li);
                break;
            case 'gpx':
                count.gpx++;

                $(li)
                    .attr({
                        id: `gpx-${pointer}`
                    })
                    .data({
                        name: file.fileName
                    });

                $('#modal-layers-files-gpx > .list-group').append(li);
                break;
            case 'kml':
                count.kml++;

                $(li)
                    .attr({
                        id: `kml-${pointer}`
                    })
                    .data({
                        name: file.fileName
                    });

                $('#modal-layers-files-kml > .list-group').append(li);
                break;
            }
        });

        if (Math.max(...Object.values(count)) === count.geojson) {
            $('#modal-layers-services')
                .val('geojson')
                .trigger('change');
        } else if (Math.max(...Object.values(count)) === count.gpx) {
            $('#modal-layers-services')
                .val('gpx')
                .trigger('change');
        } else if (Math.max(...Object.values(count)) === count.kml) {
            $('#modal-layers-services')
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
    // resumable.on('fileProgress', (file, message) => {
    //     console.log(message);
    // });

    resumable.on('fileSuccess', (file, message) => {
        const extension = file.fileName.substring(file.fileName.lastIndexOf('.') + 1, file.fileName.length) || file.name;
        const {
            title,
            description
        } = JSON.parse(message);

        let list = null;
        switch (extension.toLowerCase()) {
        case 'json':
        case 'geojson':
            list = $('#modal-layers-files-geojson > .list-group > .list-group-item');

            window.app.geojson.push({
                file: file,
                title: title,
                description: description,
                olLayer: null,
                selection: []
            });
            break;
        case 'gpx':
            list = $('#modal-layers-files-gpx > .list-group > .list-group-item');

            window.app.gpx.push({
                file: file,
                title: title,
                description: description,
                olLayer: null,
                selection: []
            });
            break;
        case 'kml':
            list = $('#modal-layers-files-kml > .list-group > .list-group-item');

            window.app.kml.push({
                file: file,
                title: title,
                description: description,
                olLayer: null,
                selection: []
            });
            break;
        }

        if (list !== null) {
            $(list).each((index, element) => {
                const {
                    identifier
                } = $(element).data();

                if (identifier === file.uniqueIdentifier) {
                    $(element)
                        .css({
                            opacity: 1
                        })
                        .on('click', (event) => {
                            event.stopPropagation();

                            $(event.delegateTarget).toggleClass('list-group-item-primary');
                        });

                    if (typeof title !== 'undefined') {
                        $(document.createElement('div'))
                            .text(title)
                            .appendTo(element);
                    }
                    if (typeof description !== 'undefined') {
                        $(document.createElement('p'))
                            .addClass('text-info small')
                            .text(description)
                            .appendTo(element);
                    }

                    return false;
                }
            });
        }
    });

    // resumable.on('complete', () => {
    // });
}
