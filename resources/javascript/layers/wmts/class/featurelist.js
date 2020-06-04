"use strict";

import displayFeatureInList from "../../../info/feature";
import { createOlLayer } from "../../../info/list/service";

/**
 * Generate list with the result of GetFeatureInfo request on a WMTS service for each queried layers in the sidebar.
 *
 * @param {object} service   WMTS service object.
 * @param {string} layerName Name of the layer.
 * @param {array}  features  Features to display.
 *
 * @returns {void}
 */
export default function(service, layerName, features) {
  const serviceTitle = service.capabilities.ServiceIdentification.Title;

  const layerIndex = service.layers.findIndex(element => element.Name === layerName);
  const layerTitle = service.layers[layerIndex].Title;

  const olElement = createOlLayer("wmts", service.getIndex(), layerIndex, layerTitle);

  const title = `${serviceTitle}<br>${layerTitle}`;

  features.forEach((feature, index) => {
    displayFeatureInList(feature, title, olElement);
  });
}
