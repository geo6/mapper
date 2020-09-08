"use strict";

import { EventsKey } from "ol/events";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import GeometryType from "ol/geom/GeometryType";
import MultiPolygon from "ol/geom/MultiPolygon";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
import { getArea } from "ol/sphere";
import unkinkPolygon from "@turf/unkink-polygon";

import { map } from "../../main";
import { drawControl } from "../../sidebar/draw";

class DrawPolygon extends Draw {
  private listener: EventsKey;
  private element: HTMLElement;

  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "Polygon" as GeometryType,
    });

    this.element = document.querySelector(".ol-measure-result");

    this.on("drawstart", (event: DrawEvent) => {
      this.listener = event.feature.on("change", () => {
        this.showArea(event.feature);
      });
    });

    this.on("drawend", (event) => {
      unByKey(this.listener);

      this.element.innerHTML = "";

      this.validate(event.feature);

      drawControl.showForm();
    });
  }

  validate(feature: Feature): Feature {
    const geojson = new GeoJSON().writeFeature(feature, {
      dataProjection: "EPSG:4326",
      decimals: 6,
      featureProjection: map.getView().getProjection(),
    });

    const valid = unkinkPolygon(JSON.parse(geojson));

    const features = new GeoJSON().readFeatures(valid, {
      dataProjection: "EPSG:4326",
      featureProjection: map.getView().getProjection(),
    });

    if (features.length > 1) {
      const coordinates = features.map((feature) =>
        feature.getGeometry().getCoordinates()
      );

      feature.setGeometry(new MultiPolygon(coordinates));
    }

    return feature;
  }

  showArea(feature: Feature): number {
    const area = getArea(feature.getGeometry());

    this.element.innerHTML = DrawPolygon.formatArea(area);

    return area;
  }

  static formatArea(area: number): string {
    if (area > 10000) {
      return Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      return Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
  }
}

export { DrawPolygon as default };
