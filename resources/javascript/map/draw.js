'use strict';

import {
    Modify,
    Snap
} from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';

import DrawPoint from './draw/point';
import DrawLineString from './draw/linestring';
import DrawPolygon from './draw/polygon';

class DrawControl {
    constructor () {
        this.active = false;
        this.type = null;

        this.layer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            zIndex: Infinity
        });
        window.app.map.addLayer(this.layer);

        this.modify = new Modify({
            source: this.layer.getSource()
        });
    }

    enable () {
        $(`#draw button.list-group-item-action[data-type=${this.type}]`).addClass('active');

        window.app.map.addInteraction(this.modify);

        switch (this.type) {
        case 'point':
            this.draw = new DrawPoint();
            break;
        case 'linestring':
            this.draw = new DrawLineString();
            break;
        case 'polygon':
            this.draw = new DrawPolygon();
            break;
        }
        window.app.map.addInteraction(this.draw);

        this.snap = new Snap({
            source: this.layer.getSource()
        });
        window.app.map.addInteraction(this.snap);
    }

    disable () {
        $(`#draw button.list-group-item-action[data-type=${this.type}]`).removeClass('active');

        if (this.snap !== null) {
            window.app.map.removeInteraction(this.snap);
            this.snap = null;
        }
        if (this.draw !== null) {
            window.app.map.removeInteraction(this.draw);
            this.draw = null;
        }

        window.app.map.removeInteraction(this.modify);
    }

    clear () {
        this.layer.getSource().clear();
    }
}

export {
    DrawControl
    as
    default
};
