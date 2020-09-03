"use strict";

import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import GeometryType from "ol/geom/GeometryType";
import MultiPolygon from "ol/geom/MultiPolygon";
import Draw from "ol/interaction/Draw";
import unkinkPolygon from "@turf/unkink-polygon";

import { map } from "../../main";
import { drawControl } from "../../sidebar/draw";

class DrawPolygon extends Draw {
  constructor() {
    super({
      source: drawControl.layerCurrent.getSource(),
      stopClick: true,
      type: "Polygon" as GeometryType,
    });

    this.on("drawend", (event) => {
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
}

export { DrawPolygon as default };
