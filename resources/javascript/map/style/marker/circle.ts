"use strict";

import { Circle, Fill, Stroke } from "ol/style";

export default function (stroke: Stroke, fill: Fill, size: number): Circle {
  return new Circle({
    fill,
    stroke,
    radius: size,
  });
}
