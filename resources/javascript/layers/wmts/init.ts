"use strict";

import WMTS from "../WMTS";
import ServiceOptions from "../../_interface/ServiceOptions";

import { services } from "../../main";

export default function (layers: ServiceOptions[]): void {
  layers.forEach((layer: ServiceOptions) => {
    const wmts = new WMTS(layer.url, (service) => {
      service.displayCapabilities();

      if (typeof layer.default !== "undefined" && layer.default.length > 0) {
        service.addToMap(layer.default);
      }
    });

    services.wmts.push(wmts);
  });

  document
    .getElementById("btn-layers-add-wmts")
    .addEventListener("click", (event: Event) => {
      event.preventDefault();

      const url = prompt("Enter the WMTS service url :");

      if (url !== null && url !== "") {
        const wmts = new WMTS(url, (service: WMTS) => {
          service.displayCapabilities();

          const select = document.getElementById(
            "modal-layers-select"
          ) as HTMLSelectElement;

          select.value = `wmts:${service.getIndex()}`;
          select.dispatchEvent(new Event("change"));
        });

        services.wmts.push(wmts);
      }
    });
}
