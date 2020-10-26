"use strict";

import Feature from "ol/Feature";

import WMS from "../../WMS";
import createLI from "../../../sidebar/info/list";

/**
 * Generate list with the result of GetFeatureInfo request on a WMS service for each queried layers in the sidebar.
 *
 * @param service   WMS service object.
 * @param layerName Name of the layer.
 * @param features  Features to display.
 */
export default function (
  service: WMS,
  layerName: string,
  features: Feature[]
): void {
  const serviceTitle = service.capabilities.Service.Title;

  const layerIndex = service.layers.findIndex(
    (layer) => layer.Name === layerName
  );
  const layerTitle = service.layers[layerIndex].Title;

  const listElement = document.getElementById("info-list");
  const detailsElement = document.getElementById("info-details");

  listElement.append(
    createLI(`${serviceTitle}<br>${layerTitle}`, features, {
      list: listElement,
      details: detailsElement,
    })
  );
}
