"use strict";

import { sidebar } from "../../../main";

export default function (service, layer) {
  let queryable = false;
  if (typeof layer.ResourceURL !== "undefined") {
    layer.ResourceURL.forEach((resource) => {
      if (
        resource.resourceType === "FeatureInfo" &&
        resource.format === "application/json"
      ) {
        queryable = true;

        return false;
      }
    });
  }

  let legend = null;
  if (
    typeof layer.Style !== "undefined" &&
    layer.Style.length > 0 &&
    typeof layer.Style[0].LegendURL !== "undefined" &&
    layer.Style[0].LegendURL.length > 0
  ) {
    legend = document.createElement("img");

    legend.src = layer.Style[0].LegendURL[0].href;
    legend.alt = `Legend "${name}"`;

    legend.classList.add("img-fluid");
  }

  const li = sidebar.addLayerInList(
    "wmts",
    service.getIndex(),
    layer.Name || layer.Identifier,
    layer.Title,
    queryable,
    false,
    legend
  );

  if (
    typeof service.capabilities.OperationsMetadata.GetFeatureInfo !==
      "undefined" &&
    queryable &&
    service.mixedContent === true
  ) {
    const icon = li.querySelector(".fa-info-circle");
    icon.classList.add("text-light");
    icon.style.cursor = "help";
    icon.title = "GetFeatureInfo is disabled because of Mixed Active Content.";
  }
}
