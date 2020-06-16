"use strict";

import File from "../../../layers/File";

import { modalSettings } from "../../../main";

export default function (type: string, file: File | null): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-settings";
  button.disabled =
    file === null || ["csv", "geojson", "gpx", "kml"].indexOf(file.type) === -1;
  button.innerHTML = '<i class="fas fa-tools"></i>';
  button.title = "Settings";

  if (button.disabled === false) {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();

      modalSettings.reset();
      modalSettings.setLayer(file, file.name);
      modalSettings.show();
    });
  }

  return button;
}
