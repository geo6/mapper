"use strict";

import File from "../../../layers/File";
import WMS from "../../../layers/WMS";
import WMTS from "../../../layers/WMTS";

export default function (
  type: string,
  layer: File | WMS | WMTS,
  name?: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-remove";
  button.innerHTML = '<i class="far fa-trash-alt"></i>';
  button.title = "Remove";

  button.addEventListener("click", (event: Event) => {
    event.preventDefault();

    if (["wms", "wmts"].indexOf(type) > -1) {
      button.closest("li.list-group-item").remove();

      layer.removeLayer(name);
    } else {
      layer.removeLayer();
    }
  });

  return button;
}
