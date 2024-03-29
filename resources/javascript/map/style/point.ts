"use strict";

import { asArray, Color } from "ol/color";
import { Fill, Stroke, Style } from "ol/style";

import markerCircle from "./marker/circle";
import markerCross from "./marker/cross";
import markerSquare from "./marker/square";
import markerStar from "./marker/star";
import markerTriangle from "./marker/triangle";

export default function (
  color: string | Color | null,
  size: number | null,
  symbol: string | null
): Style {
  if (color === null) {
    color = [0, 0, 0] as Color;
  }
  if (size === null) {
    size = 5;
  }
  if (symbol === null) {
    symbol = "circle";
  }

  const colorArray = asArray(color);
  colorArray[3] = 0.8;

  const fill = new Fill({
    color: colorArray,
  });
  const stroke = new Stroke({
    color,
    width: 2,
  });

  switch (symbol.toLowerCase()) {
    case "circle-stroked":
      return new Style({
        image: markerCircle(
          stroke,
          new Fill({ color: "rgba(255,255,255,0)" }),
          size
        ),
      });
    case "cross":
      return new Style({ image: markerCross(stroke, fill, size) });
    case "square":
      return new Style({ image: markerSquare(stroke, fill, size) });
    case "square-stroked":
      return new Style({
        image: markerSquare(
          stroke,
          new Fill({ color: "rgba(255,255,255,0)" }),
          size
        ),
      });
    case "star":
      return new Style({ image: markerStar(stroke, fill, size) });
    case "star-stroked":
      return new Style({
        image: markerStar(
          stroke,
          new Fill({ color: "rgba(255,255,255,0)" }),
          size
        ),
      });
    case "triangle":
      return new Style({ image: markerTriangle(stroke, fill, size) });
    case "triangle-stroked":
      return new Style({
        image: markerTriangle(
          stroke,
          new Fill({ color: "rgba(255,255,255,0)" }),
          size
        ),
      });
    case "circle":
    default:
      return new Style({ image: markerCircle(stroke, fill, size) });
  }
}
