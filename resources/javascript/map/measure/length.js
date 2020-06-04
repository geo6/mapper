"use strict";

import { getLength } from "ol/sphere";

/**
 * Format length output.
 *
 * @param {module:ol/geom/LineString~LineString} line The line.
 *
 * @return {string} The formatted length.
 */
export function formatLength(line) {
  const length = getLength(line);

  if (length > 100) {
    return Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    return Math.round(length * 100) / 100 + " " + "m";
  }
}

/**
 * Create DOM button element to enable length measure tool.
 *
 * @returns {Element} DOM button element.
 */
export function createButton() {
  const button = document.createElement("button");

  button.innerHTML = '<i class="fas fa-fw fa-ruler"></i>';
  button.title = "Measuring tool: Distance";

  return button;
}
