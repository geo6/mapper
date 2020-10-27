"use strict";

import { FeatureLike } from "ol/Feature";
import VectorLayer from "ol/layer/Vector";

export default function (
  layer: VectorLayer,
  value: string,
  filter?: Record<string, string>
): FeatureLike[] {
  let features = layer.getSource().getFeatures();

  if (typeof filter !== "undefined" && filter !== null) {
    features = features.filter((feature) => {
      const properties = feature.getProperties();
      const result = Object.keys(filter).map((key: string) => {
        return properties[key] === filter[key];
      });

      return result.indexOf(false) === -1;
    });
  }

  return features.filter((feature) => {
    const properties = feature.getProperties();

    for (const prop in properties) {
      if (
        typeof properties[prop] === "number" ||
        typeof properties[prop] === "string"
      ) {
        const compare = properties[prop]
          .toString()
          .localeCompare(value, navigator.language, {
            ignorePunctuation: true,
            sensitivity: "base",
            usage: "search",
          });

        if (
          compare === 0 ||
          properties[prop]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        ) {
          return true;
        }
      }
    }

    return false;
  });
}
