"use strict";

/**
 * Create and add DOM div element that will contain the measure result
 * to the DOM div Element containing the map.
 *
 * @param string element Map element ID.
 *
 * @returns {Element} DOM div element that will contain the measure result.
 */
export default function (element: string): HTMLDivElement {
  const div = document.createElement("div");

  div.className = "ol-measure-result";

  document.getElementById(element).prepend(div);

  return div;
}
