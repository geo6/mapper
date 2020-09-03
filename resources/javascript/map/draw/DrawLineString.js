"use strict";

import Draw from "ol/interaction/Draw";

import { drawControl } from "../../sidebar/draw";

class DrawLineString extends Draw {
  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "LineString",
    });

    this.on("drawend", () => {
      drawControl.showForm();
    });
  }
}

export { DrawLineString as default };
