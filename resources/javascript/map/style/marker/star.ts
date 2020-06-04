"use strict";

import { Fill, RegularShape, Stroke } from "ol/style";

export default function (
  stroke: Stroke,
  fill: Fill,
  size: number
): RegularShape {
  return new RegularShape({
    fill,
    stroke,
    points: 5,
    radius: size,
    radius2: size - 5,
    angle: 0,
  });
}
