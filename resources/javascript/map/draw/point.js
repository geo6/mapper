'use strict';

import Draw from 'ol/interaction/Draw';

class DrawPoint extends Draw {
    constructor () {
        super({
            source: window.app.draw.layer.getSource(),
            stopClick: true,
            type: 'Point'
        });

        this.on('drawend', (event) => {
            const count = parseInt(document.getElementById('draw-count-point').innerText);

            event.feature.setId(`point-${count + 1}`);

            document.getElementById('btn-draw-clear').disabled = false;
            document.getElementById('btn-draw-export').disabled = false;

            document.getElementById('draw-count-point').innerText = `${count + 1}`;
        });
    }
}

export { DrawPoint as default };
