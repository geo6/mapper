'use strict';

import { toStringXY } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {
    getArea,
    getLength
} from 'ol/sphere';

import { map } from '../main';

/**
 * Display selected Feature geometry.
 *
 * @param {object} geometry Feature geometry.
 *
 * @returns {void}
 */
export default function (geometry) {
    const divGeometry = $('#info-details-geometry');
    const geometryType = geometry.getType();

    $('#infos-details-btn-locate')
        .prop('disabled', false)
        .on('click', () => {
            const extent = geometry.getExtent();

            map.getView()
                .fit(extent, {
                    maxZoom: 18,
                    padding: [15, 15, 15, 15]
                });
        });

    $(divGeometry)
        .empty()
        .append([
            geometryType,
            '<br>'
        ])
        .show();

    switch (geometryType) {
    case 'Point': {
        const coordinates = geometry.getCoordinates();

        $(divGeometry).append(toStringXY(toLonLat(coordinates), 6));
        break;
    }
    case 'MultiPoint': {
        const points = geometry.getPoints();

        $(divGeometry).append([
            points.length,
            '<br>'
        ]);

        if (points.length === 1) {
            const coordinates = geometry.getPoint(0).getCoordinates();

            $(divGeometry).append(toStringXY(toLonLat(coordinates), 6));
        }
        break;
    }
    case 'LineString': {
        const length = Math.round(getLength(geometry));

        $(divGeometry).append(`${length} m.`);
        break;
    }
    case 'MultiLineString': {
        const linestrings = geometry.getLineStrings();

        $(divGeometry).append([
            linestrings.length,
            '<br>'
        ]);

        if (linestrings.length === 1) {
            const length = Math.round(getLength(geometry.getLineString(0)));

            $(divGeometry).append(`${length} m.`);
        }
        break;
    }
    case 'Polygon': {
        const area = Math.round(getArea(geometry));

        $(divGeometry).append(`${area} m&sup2;`);
        break;
    }
    case 'MultiPolygon': {
        const polygons = geometry.getPolygons();

        $(divGeometry).append([
            polygons.length,
            '<br>'
        ]);

        if (polygons.length === 1) {
            const area = Math.round(getArea(geometry.getPolygon(0)));

            $(divGeometry).append(`${area} m&sup2;`);
        }
        break;
    }
    }

    $('#info-details').append(divGeometry);
}
