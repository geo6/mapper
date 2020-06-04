"use strict";

import { asArray, Color } from "ol/color";
import { Fill, Stroke, Style } from "ol/style";

export default function(
  strokeColor: string | Color | null,
  strokeWidth: number | null,
  strokeOpacity: number | null,
  fillColor: string | Color | null,
  fillOpacity: number | null
): Style {
  if (strokeColor === null) {
    strokeColor = [0, 0, 0] as Color;
  }
  if (strokeWidth === null) {
    strokeWidth = 1.25;
  }
  if (strokeOpacity === null) {
    strokeOpacity = 1;
  }
  if (fillColor === null) {
    fillColor = [0, 0, 0] as Color;
  }
  if (fillOpacity === null) {
    fillOpacity = 0.4;
  }

  const strokeColorArray = asArray(strokeColor);
  strokeColorArray[3] = strokeOpacity;

  const fillColorArray = asArray(fillColor);
  fillColorArray[3] = fillOpacity;

  return new Style({
    stroke: new Stroke({
      color: strokeColorArray,
      width: strokeWidth
    }),
    fill: new Fill({
      color: fillColorArray
    })
  });
}
