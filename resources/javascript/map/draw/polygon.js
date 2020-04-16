'use strict';

import Draw from 'ol/interaction/Draw';

class DrawPolygon extends Draw {
    constructor () {
        super({
            source: window.app.draw.layer.getSource(),
            stopClick: true,
            type: 'Polygon'
        });

        this.on('drawend', (event) => {
            const count = parseInt(document.getElementById('draw-count-polygon').innerText);

            event.feature.setId(`polygon-${count + 1}`);

            document.getElementById('btn-draw-clear').disabled = false;
            document.getElementById('btn-draw-export').disabled = false;

            document.getElementById('draw-count-polygon').innerText = `${count + 1}`;
        });
    }
}

export { DrawPolygon as default };
