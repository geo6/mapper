'use strict';

import { asArray as colorAsArray } from 'ol/color';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';

export default function style (feature, resolution) {
    const { color } = feature.getProperties();

    const fill = new Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    const stroke = new Stroke({
        color: '#3399CC',
        width: 1.25
    });

    if (typeof color !== 'undefined' && color !== null) {
        stroke.setColor(colorAsArray(color));
    }

    return [
        new Style({
            image: new CircleStyle({
                fill: fill,
                stroke: stroke,
                radius: 5
            }),
            fill: fill,
            stroke: stroke
        })
    ];
}
