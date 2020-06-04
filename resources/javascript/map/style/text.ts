"use strict";

import Feature from "ol/Feature";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";

export default function(feature: Feature, labelColumn: string) {
  const type = feature.getGeometry().getType();
  const properties = feature.getProperties();

  const label =
    labelColumn !== null && typeof properties[labelColumn] !== "undefined"
      ? properties[labelColumn]
      : null;

  if (label !== null) {
    const textOptions = {
      stroke: new Stroke({
        color: "#fff",
        width: 2
      }),
      text: label.toString()
    };

    switch (type) {
      case "Point":
      case "MultiPoint":
        Object.assign(textOptions, {
          offsetY: 12
        });
        break;

      case "LineString":
      case "MultiLineString":
        Object.assign(textOptions, {
          overflow: true,
          placement: "line"
        });
        break;

      case "Polygon":
      case "MultiPolygon":
        Object.assign(textOptions, {
          overflow: true
        });
        break;
    }

    return new Text(textOptions);
  }

  return null;
}
