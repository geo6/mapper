"use strict";

import { getArea } from "ol/sphere";

/**
 * Format area output.
 *
 * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
 *
 * @return {string} Formatted area.
 */
export function formatArea(polygon) {
  const area = getArea(polygon);

  if (area > 10000) {
    return (
      Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"
    );
  } else {
    return Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
}

/**
 * Create DOM button element to enable area measure tool.
 *
 * @returns {Element} DOM button element.
 */
export function createButton() {
  const button = document.createElement("button");

  button.innerHTML = "<i class=\"fas fa-fw fa-draw-polygon\"></i>";
  button.title = "Measuring tool: Area";

  return button;
}
