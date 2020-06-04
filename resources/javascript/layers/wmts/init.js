"use strict";

import initWMTSAddService from "./new";
import WMTS from "./wmts";

export default function (layers) {
  window.app.wmts = [];

  layers.forEach((layer) => {
    const wmts = new WMTS(layer.url, (service) => {
      service.displayCapabilities();

      if (typeof layer.default !== "undefined" && layer.default.length > 0) {
        service.addToMap(layer.default);
        service.addToSidebar(layer.default);
      }
    });

    window.app.wmts.push(wmts);
  });

  initWMTSAddService();
}
