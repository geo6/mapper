"use strict";

import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

import File from "../../File";
import ExtendedFeatureCollection from "../../ExtendedFeatureCollection";

import { map } from "../../main";

export function add(file: File): VectorSource {
  let features = new GeoJSON().readFeatures(file.content, {
    featureProjection: map.getView().getProjection(),
  });

  if (typeof file.filter !== "undefined" && file.filter !== null) {
    features = features.filter((feature) => {
      const properties = feature.getProperties();

      const result = Object.keys(file.filter).map((key: string) => {
        return properties[key] === file.filter[key];
      });

      return result.indexOf(false) === -1;
    });
  }

  return new VectorSource({
    features,
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
