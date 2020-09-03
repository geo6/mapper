"use strict";

import Draw from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";

import { drawControl } from "../../sidebar/draw";

class DrawLineString extends Draw {
  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "LineString" as GeometryType,
    });

    this.on("drawend", () => {
      drawControl.showForm();
    });
  }
}

export { DrawLineString as default };
