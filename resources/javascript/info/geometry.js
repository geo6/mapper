'use strict';

import {
    toLonLat
} from 'ol/proj';
import {
    toStringXY
} from 'ol/coordinate';

/**
 * Display selected Feature geometry.
 *
 * @param {object} geometry Feature geometry.
 *
 * @returns {void}
 */
export default function (geometry) {
    let divGeometry = $('#info-details-geometry');
    let geometryType = geometry.getType();

    $('#infos-details-btn-locate')
        .prop('disabled', false)
        .on('click', () => {
            let extent = geometry.getExtent();

            window.app.map.getView()
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
    case 'Point':
        let coordinates = geometry.getCoordinates();

        $(divGeometry).append(toStringXY(toLonLat(coordinates), 6));
        break;
    case 'MultiPoint':
        let points = geometry.getPoints();

        $(divGeometry).append([
            points.length,
            '<br>'
        ]);

        if (points.length === 1) {
            let coordinates = geometry.getPoint(0).getCoordinates();

            $(divGeometry).append(toStringXY(toLonLat(coordinates), 6));
        }
        break;

    case 'LineString':
        let length = Math.round(geometry.getLength());

        $(divGeometry).append(`${length} m.`);
        break;
    case 'MultiLineString':
        let linestrings = geometry.getLineStrings();

        $(divGeometry).append([
            linestrings.length,
            '<br>'
        ]);

        if (linestrings.length === 1) {
            let length = Math.round(geometry.getLineString(0).getLength());

            $(divGeometry).append(`${length} m.`);
        }
        break;

    case 'Polygon':
        let area = Math.round(geometry.getArea());

        $(divGeometry).append(`${area} m&sup2;`);
        break;
    case 'MultiPolygon':
        let polygons = geometry.getPolygons();

        $(divGeometry).append([
            polygons.length,
            '<br>'
        ]);

        if (polygons.length === 1) {
            let area = Math.round(geometry.getPolygon(0).getArea());

            $(divGeometry).append(`${area} m&sup2;`);
        }
        break;
    }

    $('#info-details').append(divGeometry);
}
