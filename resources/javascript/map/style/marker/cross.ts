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
    points: 4,
    radius: size,
    radius2: 0,
    angle: Math.PI / 4,
  });
}
