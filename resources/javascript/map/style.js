'use strict';

import { asArray as colorAsArray } from 'ol/color';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';
import Text from 'ol/style/Text';

export default function style (feature, labelColumn, color, resolution) {
    const properties = feature.getProperties();

    const fill = new Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    const stroke = new Stroke({
        color: '#3399CC',
        width: 1.25
    });

    if (color !== null) {
        stroke.setColor(color);

        const fillColor = colorAsArray(color);
        fillColor[3] = 0.4;
        fill.setColor(fillColor);
    } else if (typeof properties.color !== 'undefined' && properties.color !== null) {
        stroke.setColor(colorAsArray(properties.color));
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
            text: text(feature, labelColumn)
        })
    ];
}

function text (feature, labelColumn) {
    const type = feature.getGeometry().getType();
    const properties = feature.getProperties();

    const label = labelColumn !== null && typeof properties[labelColumn] !== 'undefined' ? properties[labelColumn] : null;

    if (label !== null) {
        const textOptions = {
            stroke: new Stroke({
                color: '#fff',
                width: 2
            }),
            text: label.toString()
        };

        switch (type) {
        case 'Point':
        case 'MultiPoint':
            Object.assign(textOptions, {
                offsetY: 12
            });
            break;

        case 'LineString':
        case 'MultiLineString':
            Object.assign(textOptions, {
                overflow: true,
                placement: 'line'
            });
            break;

        case 'Polygon':
        case 'MultiPolygon':
            Object.assign(textOptions, {
                overflow: true
            });
            break;
        }

        return new Text(textOptions);
    }

    return null;
}
