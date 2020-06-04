"use strict";

import Draw from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { formatArea } from "./area";
import { formatLength } from "./length";

/**
 * Create the OpenLayers Draw Interaction.
 *
 * @param {module:ol/Map~Map} map OL Map.
 * @param {Element} element DOM div Element that will contain the measure result.
 * @param {module:ol/source/Vector~VectorSource} source OL Vector Source.
 * @param {string} type Measure tool type (length|area).
 * @param {number} maxPoints The number of points that can be drawn before a polygon ring or line string is finished.
 *
 * @returns {module:ol/interaction/Draw} OL Draw Interaction.
 */
export default function(map, element, source, type, maxPoints) {
  let feature;
  let output = "-";

  const draw = new Draw({
    maxPoints:
            type !== "length" || typeof maxPoints === "undefined"
              ? Infinity
              : maxPoints,
    source: source,
    stopClick: true,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)"
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)"
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)"
        })
      })
    }),
    type: type === "area" ? "Polygon" : "LineString"
  });

  draw.on("drawstart", eventDrawStart => {
    eventDrawStart.feature.getGeometry().on("change", eventChange => {
      feature = eventChange.target;

      if (type === "area") {
        output = "<strong>Area:</strong> " + formatArea(feature);
      } else {
        output = "<strong>Length:</strong> " + formatLength(feature);
      }

      element.innerHTML = output;
    });
  });

  draw.on("drawend", event => {
    map.removeInteraction(draw);

    if (type === "area") {
      output = "<strong>Area:</strong> " + formatArea(feature);
    } else {
      output = "<strong>Length:</strong> " + formatLength(feature);
    }

    element.innerHTML = output;
  });

  return draw;
}
