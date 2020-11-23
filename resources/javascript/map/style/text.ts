"use strict";

import Feature from "ol/Feature";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";

export default function (feature: Feature, labelColumn: string): Text | null {
  const type = feature.getGeometry().getType();
  const properties = feature.getProperties();

  if (labelColumn !== null) {
    let label = "";
    if (labelColumn === "feature.id") {
      label = (feature.getId() || '').toString();
    } else if (typeof properties[labelColumn] !== "undefined") {
      label = properties[labelColumn].toString();
    }

    const textOptions = {
      stroke: new Stroke({
        color: "#fff",
        width: 2,
      }),
      text: label,
    };

    switch (type) {
      case "Point":
      case "MultiPoint":
        Object.assign(textOptions, {
          offsetY: 12,
        });
        break;

      case "LineString":
      case "MultiLineString":
        Object.assign(textOptions, {
          overflow: true,
          placement: "line",
        });
        break;

      case "Polygon":
      case "MultiPolygon":
        Object.assign(textOptions, {
          overflow: true,
        });
        break;
    }

    return new Text(textOptions);
  }

  return null;
}
