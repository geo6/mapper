"use strict";

import Draw from "ol/interaction/Draw";

class DrawPoint extends Draw {
  constructor() {
    super({
      source: window.app.draw.layerCurrent.getSource(),
      stopClick: true,
      type: "Point"
    });

    this.on("drawend", () => {
      window.app.draw.showForm();
    });
  }
}

export { DrawPoint as default };
