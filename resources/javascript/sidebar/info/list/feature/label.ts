"use strict";

import Feature from "ol/Feature";

export default function (feature: Feature, labelColumn: string | null): string {
  const id = feature.getId();
  const properties = feature.getProperties();

  if (
    typeof labelColumn !== "undefined" &&
    labelColumn !== null &&
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
