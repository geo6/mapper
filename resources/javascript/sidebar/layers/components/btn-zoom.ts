"use strict";

import File from "../../../layers/File";
import WMS from "../../../layers/WMS";
import WMTS from "../../../layers/WMTS";

export default function (
  type: string,
  layer: File | WMS | WMTS,
  name?: string
): HTMLButtonElement {
  // OL doesn't read correctly CRS from WMS Capabilites < 1.3.0 (SRS instead of CRS)
  // See https://github.com/openlayers/openlayers/issues/5476
  const zoom = type !== "wms" || (layer as WMS).capabilities.version >= "1.3.0";

  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-zoom";
  button.disabled = !zoom;
  button.innerHTML = '<i class="fas fa-search-location"></i>';
  button.title = "Zoom";

  if (button.disabled === false) {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();

      if (["wms", "wmts"].indexOf(type) > -1) {
        layer.zoom(name);
      } else {
        (layer as File).zoom();
      }
    });
  }

  return button;
}
