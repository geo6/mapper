"use strict";

import initWMSAddService from "./new";
import WMS from "./wms";

export default function(layers) {
  window.app.wms = [];

  layers.forEach((layer) => {
    const wms = new WMS(layer.url, (service) => {
      service.displayCapabilities();

      if (typeof layer.default !== "undefined" && layer.default.length > 0) {
        service.addToMap(layer.default);
        service.addToSidebar(layer.default);
      }
    });

    window.app.wms.push(wms);
  });

  initWMSAddService();
}
