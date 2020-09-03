"use strict";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

/**
 * Create OpenLayers VectorLayer.
 *
 * @returns {module:ol/layer/Vector~VectorLayer} OL VectorLayer.
 */
export default function (): VectorLayer {
  return new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    }),
  });
}
