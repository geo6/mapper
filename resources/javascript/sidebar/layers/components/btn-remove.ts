"use strict";

import { files } from "../../../main";

export default function (
  type: string,
  index: number,
  layer: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-remove";
  button.innerHTML = '<i class="far fa-trash-alt"></i>';
  button.title = "Remove";

  button.addEventListener("click", (event: Event) => {
    event.preventDefault();

    button.closest("li.list-group-item").remove();

    if (["wms", "wmts"].indexOf(type) > -1) {
      window.app[type][index].removeLayer(layer);
    } else {
      files[type][index].removeFromMap();
    }
  });

  return button;
}
