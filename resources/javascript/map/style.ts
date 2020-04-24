"use strict";

import { asArray as colorAsArray, Color } from "ol/color";
import Feature from "ol/Feature";
import { Circle, Fill, RegularShape, Stroke, Style } from "ol/style";
import Text from "ol/style/Text";

function setImage(
  symbol: string,
  stroke: Stroke,
  fill: Fill,
  size: number
): Circle | RegularShape {
  switch (symbol.toLowerCase()) {
    case "circle":
    default:
      return new Circle({
        fill: fill,
        stroke: stroke,
        radius: size,
      });
    case "cross":
      return new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: size,
        radius2: 0,
        angle: Math.PI / 4,
      });
    case "square":
      return new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: size,
        angle: Math.PI / 4,
      });
    case "star":
      return new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 5,
        radius: size,
        radius2: size - 5,
        angle: 0,
      });
    case "triangle":
      return new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 3,
        radius: size,
        angle: 0,
      });
  }
}

export default function style(
  feature: Feature,
  labelColumn: string,
  color: string | Color,
  resolution: number
) {
  const type = feature.getGeometry().getType();
  const properties = feature.getProperties();

  const fill = new Fill({
    color: "rgba(0,0,0,0.4)",
  });
  const stroke = new Stroke({
    color: "#000",
    width: 1.25,
  });

  // Color defined in layers settings.
  if (color !== null) {
    stroke.setColor(color);

    const fillColor = colorAsArray(color);
    fillColor[3] = type === "Point" || type === "MultiPoint" ? 0.7 : 0.4;
    fill.setColor(fillColor);
  }
  // Color from Feature properties.
  else if (
    typeof properties.color !== "undefined" &&
    properties.color !== null
  ) {
    stroke.setColor(colorAsArray(properties.color));

    const fillColor = colorAsArray(properties.color);
    fillColor[3] = type === "Point" || type === "MultiPoint" ? 0.7 : 0.4;
    fill.setColor(fillColor);
  }

  const symbol = properties["marker-symbol"] || "circle";
  const image = setImage(symbol, stroke, fill, properties["marker-size"] || 5);

  return [
    new Style({
      image,
      fill: fill,
      stroke: stroke,
      text: text(feature, labelColumn),
    }),
  ];
}

function text(feature: Feature, labelColumn: string) {
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
        width: 2,
      }),
      text: label.toString(),
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
