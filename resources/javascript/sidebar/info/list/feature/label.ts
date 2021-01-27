"use strict";

import { FeatureLike } from "ol/Feature";

export default function (
  feature: FeatureLike,
  labelColumn: string | null
): string {
  const id = feature.getId();
  const properties = feature.getProperties();

  if (
    typeof labelColumn !== "undefined" &&
    labelColumn !== null &&
    typeof properties[labelColumn] !== "undefined" &&
    properties[labelColumn] !== null &&
    properties[labelColumn].toString().length > 0
  ) {
    return properties[labelColumn].toString();
  }

  if (typeof id !== "undefined" && id !== null) {
    return `Feature id: ${id}`;
  }

  for (const prop in properties) {
    if (
      typeof properties[prop] === "number" ||
      typeof properties[prop] === "string"
    ) {
      return `<em>${prop}</em>: ${properties[prop]}`;
    }
  }

  return "";
}
