"use strict";

import { files, modalSettings } from "../../../main";

export default function(
  type: string,
  index: number,
  name: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-settings";
  button.disabled = ["csv", "geojson", "gpx", "kml"].indexOf(type) === -1;
  button.innerHTML = "<i class=\"fas fa-tools\"></i>";
  button.title = "Settings";

  if (button.disabled === false) {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();

      modalSettings.reset();
      modalSettings.setLayer(files[type][index], name);
      modalSettings.show();
    });
  }

  return button;
}
