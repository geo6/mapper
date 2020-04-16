'use strict';

import Draw from 'ol/interaction/Draw';

class DrawLineString extends Draw {
    constructor () {
        super({
            source: window.app.draw.layer.getSource(),
            stopClick: true,
            type: 'LineString'
        });

        this.on('drawend', (event) => {
            const count = parseInt(document.getElementById('draw-count-linestring').innerText);

            event.feature.setId(`linestring-${count + 1}`);

            document.getElementById('btn-draw-clear').disabled = false;
            document.getElementById('btn-draw-export').disabled = false;

            document.getElementById('draw-count-linestring').innerText = `${count + 1}`;
        });
    }
}

export { DrawLineString as default };
