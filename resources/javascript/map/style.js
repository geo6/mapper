'use strict';

import { asArray as colorAsArray } from 'ol/color';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';
import Text from 'ol/style/Text';

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
            stroke: stroke,
            text: text(feature)
        })
    ];
}

function getLabel (feature) {
    const { label } = feature.getProperties();

    if (typeof label !== 'undefined') {
        return label;
    }

    return null;
}

function text (feature) {
    const type = feature.getGeometry().getType();
    const label = getLabel(feature);

    if (label !== null) {
        const textOptions = {
            stroke: new Stroke({
                color: '#fff',
                width: 2
            }),
            text: label
        };

        switch (type) {
        case 'Point':
        case 'MultiPoint':
            $.extend(textOptions, {
                offsetY: 12
            });
            break;

        case 'LineString':
        case 'MultiLineString':
            $.extend(textOptions, {
                overflow: true,
                placement: 'line'
            });
            break;

        case 'Polygon':
        case 'MultiPolygon':
            $.extend(textOptions, {
                overflow: true
            });
            break;
        }

        return new Text(textOptions);
    }

    return null;
}
