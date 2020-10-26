"use strict";

import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";

export default function (
  source: VectorSource,
  value: string,
  filter: Record<string, string>
): Feature[] {
  let features = source.getFeatures();

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
