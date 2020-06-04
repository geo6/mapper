"use strict";

import Draw from "ol/interaction/Draw";

class DrawLineString extends Draw {
  constructor() {
    super({
      source: window.app.draw.layerCurrent.getSource(),
      stopClick: true,
      type: "LineString",
    });

    this.on("drawend", () => {
      window.app.draw.showForm();
    });
  }
}

export { DrawLineString as default };
