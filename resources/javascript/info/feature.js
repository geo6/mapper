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
    const id = feature.getId();
    const properties = feature.getProperties();
    const geometryName = feature.getGeometryName();
    const geometry = feature.getGeometry();

    delete properties[geometryName];

    let label = geometry !== null ? '<i class="fas fa-vector-square"></i> ' : '';

    let labelKey = null;
    const keys = Object.keys(properties);
    const labelKeyPosition = keys.map(key => key.toLowerCase()).indexOf('label');
    if (labelKeyPosition > -1) {
        labelKey = keys[labelKeyPosition];
    }

    if (labelKey !== null && properties[labelKey].length > 0) {
        label += properties[labelKey];
    } else if (typeof id !== 'undefined') {
        label += `Feature id: ${id}`;
    } else {
        for (const prop in properties) {
            if (typeof properties[prop] === 'number' || typeof properties[prop] === 'string') {
                label += `<em>${prop}</em>: ${properties[prop]}`;

                break;
            }
        }
    }

    const li = document.createElement('li');

    $(li)
        .append(label)
        .appendTo(olElement)
        .on('click', event => {
            displayDetails(title, feature, li);

            window.app.marker.setGeometry(feature.getGeometry());
            window.app.markerLayer.setVisible(true);
        });
}
