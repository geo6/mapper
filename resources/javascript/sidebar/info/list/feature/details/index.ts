"use strict";

import Feature, { FeatureLike } from "ol/Feature";
import Geometry from "ol/geom/Geometry";

import createGeometryElement from "./geometry";
import createPropertiesElements from "./properties";

export default function (
  feature: FeatureLike
): [HTMLTableElement, HTMLDivElement] {
  const id = feature.getId();
  const properties = feature.getProperties();
  const geometry = feature.getGeometry();
  const geometryName =
    feature instanceof Feature ? feature.getGeometryName() : null;

  const table = document.createElement("table");

  table.className = "table table-bordered table-sm";

  if (typeof id !== "undefined" && id !== null) {
    const caption = document.createElement("caption");

    caption.innerHTML = `<i class="fas fa-bookmark"></i> Feature id: ${id}</strong>`;

    table.append(caption);
  }

  const tbody = document.createElement("tbody");

  if (typeof geometryName !== "undefined" && geometryName !== null) {
    delete properties[geometryName];
  }
  [
    "geometry",
    "boundedBy",
    "color",
    "marker-color",
    "marker-size",
    "marker-symbol",
    "stroke",
    "stroke-width",
    "stroke-opacity",
    "fill",
    "fill-opacity",
  ].forEach((key) => {
    delete properties[key];
  });

  tbody.append(...createPropertiesElements(properties));

  table.append(tbody);

  return [table, typeof geometry !== "undefined" ? createGeometryElement(geometry as Geometry) : document.createElement("div")];
}
