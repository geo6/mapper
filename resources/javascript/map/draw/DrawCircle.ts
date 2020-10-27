"use strict";

import { EventsKey } from "ol/events";
import Feature from "ol/Feature";
import GeometryType from "ol/geom/GeometryType";
import Circle from "ol/geom/Circle";
import { fromCircle } from "ol/geom/Polygon";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
import { toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";

import { drawControl } from "../../sidebar/draw";

class DrawCircle extends Draw {
  private listener: EventsKey;
  private target: HTMLElement;

  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "Circle" as GeometryType,
    });

    this.target = document.querySelector(".ol-measure-result");

    this.on("drawstart", (event: DrawEvent) => {
      this.listener = event.feature.on("change", () => {
        this.showRadiusAndArea(event.feature as Feature<Circle>);
      });
    });

    this.on("drawend", (event) => {
      unByKey(this.listener);

      this.target.innerHTML = "";

      event.feature.setGeometry(
        fromCircle(event.feature.getGeometry() as Circle)
      );

      drawControl.showForm();
    });
  }

  showRadiusAndArea(feature: Feature<Circle>): number {
    const center = feature.getGeometry().getCenter();
    const radius = feature.getGeometry().getRadius();
    const edgeCoordinate = [center[0] + radius, center[1]];

    const length = getDistance(toLonLat(center), toLonLat(edgeCoordinate));
    const area = Math.PI * length * length;

    this.target.innerHTML =
      "Radius: " +
      DrawCircle.formatLength(length) +
      "<br>" +
      DrawCircle.formatArea(area);

    return area;
  }

  static formatArea(area: number): string {
    if (area > 10000) {
      return Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      return Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
  }

  static formatLength(length: number): string {
    if (length >= 1000) {
      return Math.round((length / 1000) * 1000) / 1000 + " " + "km";
    } else {
      return Math.round(length * 100) / 100 + " " + "m";
    }
  }
}

export { DrawCircle as default };
