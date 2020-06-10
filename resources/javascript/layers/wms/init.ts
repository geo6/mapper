"use strict";

import ServiceOptions from "../../ServiceOptions";
import WMS from "./WMS";

import { services } from "../../main";

export default function (layers: ServiceOptions[]): void {
  layers.forEach((layer: ServiceOptions) => {
    const wms = new WMS(layer.url, (service) => {
      service.displayCapabilities();

      if (typeof layer.default !== "undefined" && layer.default.length > 0) {
        service.addToMap(layer.default);
        service.addToSidebar(layer.default);
      }
    });

    services.wms.push(wms);
  });

  document
    .getElementById("btn-layers-add-wms")
    .addEventListener("click", (event: Event) => {
      event.preventDefault();

      const url = prompt("Enter the WMS service url :");

      if (url !== null && url !== "") {
        const wms = new WMS(url, (service: WMS) => {
          service.displayCapabilities();

          const select = document.getElementById(
            "modal-layers-select"
          ) as HTMLSelectElement;

          select.value = `wms:${service.getIndex()}`;
          select.dispatchEvent(new Event("change"));
        });

        services.wms.push(wms);
      }
    });
}
