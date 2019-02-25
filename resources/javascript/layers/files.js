'use strict';

import File from '../file';

export function init (type) {
    window.app[type] = [];

    window.app.files[type].forEach(file => {
        const f = new File(type, file.identifier, file.name, file.title, file.description, true);

        if (f.type === 'geojson') {
            fetch(f.url)
                .then(response => response.json())
                .then(json => {
                    f.content = json;
                    f.displayInList();
                });
        } else {
            f.displayInList();
        }
    });
}

export function apply (type) {
    $(`#modal-layers-files-${type} .list-group-item`).each((index, element) => {
        if ($(element).hasClass('list-group-item-primary')) {
            const proj = $(element).find('select').val();

            window.app[type][index].addToMap(proj);
            window.app[type][index].displayInSidebar();

            $(element).removeClass('list-group-item-primary');
        }
    });
}
