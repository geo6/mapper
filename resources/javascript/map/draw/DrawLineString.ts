"use strict";

import { EventsKey } from "ol/events";
import Feature from "ol/Feature";
import GeometryType from "ol/geom/GeometryType";
import LineString from "ol/geom/LineString";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
import { getLength } from "ol/sphere";

import { drawControl } from "../../sidebar/draw";

class DrawLineString extends Draw {
  private listener: EventsKey;
  private element: HTMLElement;

  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "LineString" as GeometryType,
    });

    this.element = document.querySelector(".ol-measure-result");

    this.on("drawstart", (event: DrawEvent) => {
      this.listener = event.feature.on("change", () => {
        this.showLength(event.feature);
      });
    });

    this.on("drawend", () => {
      unByKey(this.listener);

      this.element.innerHTML = "";

      drawControl.showForm();
    });
  }

  showLength(feature: Feature): number {
    const length = getLength(feature.getGeometry());

    this.element.innerHTML = DrawLineString.formatLength(length);

    return length;
  }

  static formatLength(length: number): string {
    if (length >= 1000) {
      return Math.round((length / 1000) * 1000) / 1000 + " " + "km";
    } else {
      return Math.round(length * 100) / 100 + " " + "m";
    }
  }
}

export { DrawLineString as default };
