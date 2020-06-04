"use strict";

import { files } from "../../../main";

export default function(
  zoom: boolean,
  type: string,
  index: number,
  layer: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-zoom";
  button.disabled = zoom === false;
  button.innerHTML = "<i class=\"fas fa-search-location\"></i>";
  button.title = "Zoom";

  if (button.disabled === false) {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();

      if (["wms", "wmts"].indexOf(type) > -1) {
        window.app[type][index].zoom(layer);
      } else {
        files[type][index].zoom();
      }
    });
  }

  return button;
}
