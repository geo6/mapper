"use strict";

import Feature from "ol/Feature";
import GeometryType from "ol/geom/GeometryType.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { createEditingStyle } from "ol/style/Style";

export const marker: Feature = new Feature();
export const markerLayer: VectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [marker]
  }),
  style: (feature: Feature) => {
    const editingStyles = createEditingStyle();
    const type = feature.getGeometry().getType();

    return editingStyles[type];
  },
  visible: false,
  zIndex: Infinity
});
