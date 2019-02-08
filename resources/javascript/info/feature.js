'use strict';

import displayDetails from './details';

/**
 * Display list of selected features.
 *
 * @param {object}  feature      Feature object.
 * @param {string}  title        Layer title.
 * @param {object}  olElement    ol DOM element (of the layer).
 *
 * @returns {void}
 */
export default function (feature, title, olElement) {
    let id = feature.getId();
    let properties = feature.getProperties();
    let geometryName = feature.getGeometryName();
    let geometry = feature.getGeometry();

    delete properties[geometryName];

    let label = geometry !== null ? '<i class="fas fa-vector-square"></i> ' : '';

    if (typeof id !== 'undefined') {
        label += id;
    } else {
        for (const prop in properties) {
            if (typeof properties[prop] === 'number' || typeof properties[prop] === 'string') {
                label += `<em>${prop}</em>: ${properties[prop]}`;

                break;
            }
        }
    }

    let li = document.createElement('li');

    $(li)
        .append(label)
        .appendTo(olElement)
        .on('click', event => {
            displayDetails(title, feature, li);

            window.app.marker.setGeometry(feature.getGeometry());
            window.app.markerLayer.setVisible(true);
        });
}
