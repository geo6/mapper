"use strict";

import Draw from "ol/interaction/Draw";

import { drawControl } from "../../draw";

class DrawPoint extends Draw {
  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "Point",
    });

    this.on("drawend", () => {
      drawControl.showForm();
    });
  }
}

export { DrawPoint as default };
