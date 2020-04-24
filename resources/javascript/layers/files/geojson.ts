"use strict";

import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

import File from "../../file";
import ExtendedFeatureCollection from "../../ExtendedFeatureCollection";

import { map } from "../../main";

export function add(file: File): VectorSource {
  return new VectorSource({
    features: new GeoJSON().readFeatures(file.content, {
      featureProjection: map.getView().getProjection(),
    }),
  });
}

export function applyStyle(
  content: ExtendedFeatureCollection
): ExtendedFeatureCollection {
  const column = content.legendColumn;
  const styles = {};
  content.legend.forEach((l) => {
    const style = { color: l.color };

    if (typeof l.size !== "undefined" && l.size !== null) {
      Object.assign(style, { "marker-size": l.size });
    }
    if (typeof l.symbol !== "undefined" && l.symbol !== null) {
      Object.assign(style, { "marker-symbol": l.symbol });
    }

    styles[l.value.toString()] = style;
  });

  content.features.map((feature: GeoJSON.Feature) => {
    const value = feature.properties[column] || null;

    if (Object.keys(styles).indexOf(value) > -1) {
      Object.assign(feature.properties, styles[value]);
    }

    return feature;
  });

  return content;
}
