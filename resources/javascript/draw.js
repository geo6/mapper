'use strict';

import DrawControl from './map/draw';

export default function () {
    window.app.draw = new DrawControl();

    $('#sidebar a').on('click', () => {
        window.app.draw.active = $('#sidebar > .sidebar-tabs > ul > li:has(a[href="#draw"])').hasClass('active');

        if (window.app.draw.active === false) {
            window.app.draw.disable();
            window.app.draw.type = null;
        }
    });

    $('#btn-draw-clear').on('click', () => {
        window.app.draw.clear();
    });

    $('#btn-draw-export').on('click', () => {
        window.app.draw.export();
    });

    $('#draw button.list-group-item-action').on('click', (event) => {
        const {
            type
        } = $(event.currentTarget).data();
        const active = $(event.currentTarget).hasClass('active');

        if (active === true) {
            window.app.draw.disable();
            window.app.draw.type = null;
        } else {
            if (window.app.draw.type !== null) {
                window.app.draw.disable();
                window.app.draw.type = null;
            }

            window.app.draw.type = type;
            window.app.draw.enable();
        }
    });
}
