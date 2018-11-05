import Resumable from 'resumablejs/resumable';

export default function () {
    const resumable = new Resumable({
        fileType: [
            'json',
            'geojson',
            'kml'
        ],
        target: '/upload'
    });

    resumable.assignBrowse(document.getElementById('btn-layers-upload'));

    resumable.on('filesAdded', (files, skipped) => {
        files.forEach(file => {
            const count = $('#modal-layers-files-geojson > .list-group > .list-group-item').length;

            const li = document.createElement('li');
            $(li)
                .addClass('list-group-item')
                .css({
                    opacity: 0.33
                })
                .attr({
                    id: `geojson-${count}`
                })
                .data({
                    identifier: file.uniqueIdentifier
                });

            $(document.createElement('div'))
                .append(`<strong>${file.fileName}</strong>`)
                .appendTo(li);

            $('#modal-layers-files-geojson > .list-group').append(li);
        });

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
        const {
            title,
            description
        } = JSON.parse(message);

        $('#modal-layers-files-geojson > .list-group > .list-group-item').each((index, element) => {
            const { identifier } = $(element).data();

            if (identifier === file.uniqueIdentifier) {
                $(element)
                    .css({
                        opacity: 1
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

                return;
            }
        });
    });

    resumable.on('complete', () => {
        $('#progress-upload > .progress-bar')
            .attr('aria-valuenow', 0)
            .css('width', '0%');
    });
}
