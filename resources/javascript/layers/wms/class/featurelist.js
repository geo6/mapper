'use strict';

import displayFeatureInList from '../../../info/feature';
import { createOlLayer } from '../../../info/list/service';

/**
 * Generate list with the result of GetFeatureInfo request on a WMS service for each queried layers in the sidebar.
 *
 * @param {object} service   WMS service object.
 * @param {string} layerName Name of the layer.
 * @param {array}  features  Features to display.
 *
 * @returns {void}
 */
export default function (service, layerName, features) {
    const serviceTitle = service.capabilities.Service.Title;

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);
    const layerTitle = service.layers[layerIndex].Title;

    const olElement = createOlLayer('wms', service.getIndex(), layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    features.forEach((feature, index) => {
        displayFeatureInList(feature, title, olElement);
    });
}
