'use strict';

import Draw from 'ol/interaction/Draw';

class DrawPoint extends Draw {
    constructor () {
        super({
            source: window.app.draw.layer.getSource(),
            type: 'Point'
        });

        this.on('drawend', (event) => {
            const count = parseInt($('#draw-count-point').text());

            event.feature.setId(`point-${count + 1}`);

            $('#btn-draw-export').prop('disabled', false);
            $('#draw-count-point').text(count + 1);
        });
    }
}

export {
    DrawPoint
    as
    default
};
