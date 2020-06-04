"use strict";

import { sidebar } from "../../../main";

export default function (service, layer) {
  let legend = null;
  if (
    typeof layer.Style !== "undefined" &&
    layer.Style.length > 0 &&
    typeof layer.Style[0].LegendURL !== "undefined" &&
    layer.Style[0].LegendURL.length > 0
  ) {
    legend = document.createElement("img");

    legend.src = layer.Style[0].LegendURL[0].OnlineResource;
    legend.alt = `Legend "${layer.Name || layer.Identifier}"`;

    legend.classList.add("img-fluid");
  }

  const li = sidebar.addLayerInList(
    "wms",
    service.getIndex(),
    layer.Name || layer.Identifier,
    layer.Title,
    layer.queryable === true,
    // OL doesn't read correctly CRS from WMS Capabilites < 1.3.0 (SRS instead of CRS)
    // See https://github.com/openlayers/openlayers/issues/5476
    service.capabilities.version >= "1.3.0",
    legend
  );

  if (layer.queryable === true && service.mixedContent === true) {
    const icon = li.querySelector(".fa-info-circle");
    icon.classList.add("text-light");
    icon.style.cursor = "help";
    icon.title = "GetFeatureInfo is disabled because of Mixed Active Content.";
  }
}
