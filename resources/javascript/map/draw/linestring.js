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
            const count = parseInt($('#draw-count-linestring').text());

            event.feature.setId(`linestring-${count + 1}`);

            $('#btn-draw-export').prop('disabled', false);
            $('#draw-count-linestring').text(count + 1);
        });
    }
}

export { DrawLineString as default };
