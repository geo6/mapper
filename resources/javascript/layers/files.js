'use strict';

import File from '../file';

export function init (type) {
    window.app[type] = [];

    window.app.files[type].forEach(file => {
        const f = new File(type, file.identifier, file.name, file.title, file.description, true);

        f.displayInList();
    });
}

export function apply (type) {
    $(`#modal-layers-files-${type} .list-group-item`).each((index, element) => {
        if ($(element).hasClass('list-group-item-primary')) {
            window.app[type][index].addToMap();
            window.app[type][index].displayInSidebar();

            $(element).removeClass('list-group-item-primary');
        }
    });
}
