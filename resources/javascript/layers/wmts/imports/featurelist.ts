"use strict";

import Feature from "ol/Feature";

import WMTS from "../../WMTS";
import createLI from "../../../sidebar/info/list";

/**
 * Generate list with the result of GetFeatureInfo request on a WMTS service for each queried layers in the sidebar.
 *
 * @param service   WMTS service object.
 * @param layerName Name of the layer.
 * @param features  Features to display.
 */
export default function (
  service: WMTS,
  layerName: string,
  features: Feature[]
): void {
  const serviceTitle = service.capabilities.ServiceIdentification.Title;

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
