'use strict';

import Draw from 'ol/interaction/Draw';

class DrawPolygon extends Draw {
    constructor () {
        super({
            source: window.app.draw.layerCurrent.getSource(),
            stopClick: true,
            type: 'Polygon'
        });

        this.on('drawend', () => {
            window.app.draw.showForm();
        });
    }
}

export { DrawPolygon as default };
