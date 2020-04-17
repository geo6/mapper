'use strict';

import displayGeometry from './geometry';

/**
 * Display details of a feature in the sidebar.
 *
 * @param {string} title     Layer title.
 * @param {object} feature   Feature object.
 * @param {object} liElement Clicked li DOM element in the features list.
 *
 * @returns {void}
 */
export default function (title, feature, liElement) {
    $('#info-list').hide();
    $('#info-details').show();

    $('#info-details > table > caption, #info-details > table > tbody').empty();
    $('#info-details-geometry').empty().hide();

    const items = $('#info-list ol > li');
    const current = $(items).index(liElement);

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

    const titleFormatted = title.replace(/(\r\n|\n\r|\r|\n)/g, '<br>' + '$1');
    $('#info-details > table > caption')
        .html(`<strong>${titleFormatted}</strong>`);

    const id = feature.getId();
    if (typeof id !== 'undefined') {
        $('#info-details > table > caption')
            .append(`<br><br><i class="fas fa-bookmark"></i> Feature id: ${id}</strong>`);
    }

    const properties = feature.getProperties();
    for (const key in properties) {
        if (key === feature.getGeometryName() || key === 'boundedBy') {
            continue;
        }

        const tr = document.createElement('tr');

        $('#info-details > table > tbody')
            .append(tr);

        $(document.createElement('th'))
            .text(key)
            .appendTo(tr);
        $(document.createElement('td'))
            .text(properties[key])
            .appendTo(tr);
    }

    const geometry = feature.getGeometry();

    if (typeof geometry !== 'undefined') {
        displayGeometry(geometry);
    }
}
