'use strict';

import DrawControl from './map/draw';

export default function () {
    window.app.draw = new DrawControl();

    document.querySelectorAll('#sidebar a').forEach(element => {
        element.addEventListener('click', () => {
            const li = Array.from(document.querySelectorAll('#sidebar > .sidebar-tabs > ul > li'))
                .find(element => element.querySelector('a[href="#draw"]') !== null);

            window.app.draw.active = li.classList.contains('active');

            if (window.app.draw.active === false) {
                window.app.draw.disable();
                window.app.draw.type = null;
            }
        });
    });

    document.getElementById('btn-draw-clear').addEventListener('click', () => {
        window.app.draw.clear();
    });

    document.getElementById('btn-draw-export').addEventListener('click', () => {
        window.app.draw.export();
    });

    document.querySelectorAll('#draw button.list-group-item-action').forEach(element => {
        element.addEventListener('click', (event) => {
            const { type } = event.currentTarget.dataset;
            const active = event.currentTarget.classList.contains('active');

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
    });
}
