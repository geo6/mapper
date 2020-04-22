"use strict";

import { modalSettings } from "../../../main";

export default function (
  type: string,
  index: number,
  name: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-settings";
  button.disabled = ["csv", "geojson", "gpx", "kml"].indexOf(type) === -1;
  button.innerHTML = '<i class="fas fa-tools"></i>';
  button.title = "Settings";

  if (button.disabled === false) {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();

      const layer = window.app[type][index];
      const columns = layer.getColumns();

      modalSettings.layer = window.app[type][index];

      (document.querySelector(
        "#modal-settings .modal-body > span.font-weight-bold"
      ) as HTMLSpanElement).innerText = name;

      document.getElementById("layer-label").innerHTML =
        '<option value=""></option>';
      columns
        .filter((column: string) => column !== "geometry")
        .forEach((column: string) => {
          const option = document.createElement("option");
          option.value = column;
          option.innerText = column;
          option.selected = column === layer.label;

          document.getElementById("layer-label").append(option);
        });

      const colorInput = document.getElementById(
        "layer-color"
      ) as HTMLInputElement;
      const colorInputText = document.getElementById(
        "layer-color-text"
      ) as HTMLElement;

      if (
        layer.type === "geojson" &&
        typeof layer.content.legend === "object" &&
        Array.isArray(layer.content.legend)
      ) {
        colorInput.disabled = true;
        colorInput.value = "";

        colorInputText.innerText =
          "Function disabled because this layer has a legend.";
        colorInputText.hidden = false;
      } else if (layer.type === "kml") {
        colorInput.disabled = true;
        colorInput.value = "";

        colorInputText.innerText = "Function disabled for KML files.";
        colorInputText.hidden = false;
      } else {
        colorInput.disabled = false;
        colorInput.value = layer.color;

        colorInputText.innerText = "";
        colorInputText.hidden = true;
      }

      $("#modal-settings").modal("show");
    });
  }

  return button;
}
