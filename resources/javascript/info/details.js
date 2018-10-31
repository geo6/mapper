import displayGeometry from './geometry';

export default function (serviceTitle, layerTitle, feature, li) {
    $('#info-list').hide();
    $('#info-details').show();

    $('#info-details > table > caption, #info-details > table > tbody').empty();
    $('#info-details-geometry').empty().hide();

    let items = $('#info-list ol > li');
    let current = $(items).index(li);

    $('#info-details').data({
        current
    });

    $('#infos-list-btn-prev, #infos-list-btn-next').prop('disabled', true);
    if (current - 1 >= 0) {
        $('#infos-list-btn-prev').prop('disabled', false);
    }
    if (current + 1 < items.length) {
        $('#infos-list-btn-next').prop('disabled', false);
    }

    $('#info-details > table > caption')
        .append([
            `<strong>${serviceTitle}</strong>`,
            ' - ',
            layerTitle
        ]);

    let properties = feature.getProperties();
    for (const key in properties) {
        if (key === feature.getGeometryName() || key === 'boundedBy') {
            continue;
        }

        let tr = document.createElement('tr');

        $('#info-details > table > tbody')
            .append(tr);

        $(document.createElement('th'))
            .text(key)
            .appendTo(tr);
        $(document.createElement('td'))
            .text(properties[key])
            .appendTo(tr);
    }

    let geometry = feature.getGeometry();

    if (typeof geometry !== 'undefined') {
        displayGeometry(geometry);
    }
}
