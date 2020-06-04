"use strict";

import { Color } from "ol/color";
import Feature from "ol/Feature";
import { Style } from "ol/style";

import stylePoint from "./style/point";
import styleLine from "./style/line";
import stylePolygon from "./style/polygon";
import text from "./style/text";

export default function(
  feature: Feature,
  labelColumn: string,
  layerColor: string | Color | null,
  resolution: number
): Style {
  const type = feature.getGeometry().getType();
  const properties = feature.getProperties();

  const color =
    layerColor !== null
      ? layerColor
      : typeof properties.color !== "undefined"
        ? properties.color
        : null;

  let style = new Style();

  switch (type) {
    case "Point":
    case "MultiPoint": {
      const symbol = properties["marker-symbol"] || null;
      const size = properties["marker-size"] || null;

      style = stylePoint(color, size, symbol);
      break;
    }
    case "LineString":
    case "MultiLineString":
      style = styleLine(color, null, null);
      break;
    case "Polygon":
    case "MultiPolygon":
      style = stylePolygon(color, null, null, color, null);
      break;
  }

  style.setText(text(feature, labelColumn));

  return style;
}
