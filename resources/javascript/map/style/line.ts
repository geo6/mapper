"use strict";

import { asArray, Color } from "ol/color";
import { Stroke, Style } from "ol/style";

export default function (
  color: string | Color | null,
  width: number | null,
  opacity: number | null
): Style {
  if (color === null) {
    color = [0, 0, 0] as Color;
  }
  if (width === null) {
    width = 3;
  }
  if (opacity === null) {
    opacity = 1;
  }

  const colorArray = asArray(color);
  colorArray[3] = opacity;

  return new Style({
    stroke: new Stroke({
      color: colorArray,
      width,
    }),
  });
}
