'use strict';

export default function (index) {
    let names = [];

    $(`#modal-layers-wmts-${index} .list-group-item.list-group-item-primary`).each((index, element) => {
        const { name } = $(element).data();

        names.push(name);

        $(element).removeClass('list-group-item-primary');
    });

    if (names.length > 0) {
        window.app.wmts[index].addToMap(names);
        window.app.wmts[index].addToSidebar(names);
    }
}
