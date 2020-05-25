"use strict";

import Feature from "ol/Feature";

import displayDetails from "./details";

import { marker, markerLayer } from "../map/marker";

/**
 * Display list of selected features.
 *
 * @param Feature          feature   Feature object.
 * @param string           title     Layer title.
 * @param HTMLOListElement olElement ol DOM element (of the layer).
 */
export default function (
  feature: Feature,
  title: string,
  olElement: HTMLOListElement
) {
  const id = feature.getId();
  const properties = feature.getProperties();
  const geometryName = feature.getGeometryName();
  const geometry = feature.getGeometry();

  delete properties[geometryName];

  let label = geometry !== null ? '<i class="fas fa-vector-square"></i> ' : "";

  let labelKey = null;
  const keys = Object.keys(properties);
  const labelKeyPosition = keys
    .map((key) => key.toLowerCase())
    .indexOf("label");
  if (labelKeyPosition > -1) {
    labelKey = keys[labelKeyPosition];
  }

  if (labelKey !== null) {
    label += properties[labelKey] !== null ? properties[labelKey] : "";
  } else if (typeof id !== "undefined") {
    label += `Feature id: ${id}`;
  } else {
    for (const prop in properties) {
      if (
        typeof properties[prop] === "number" ||
        typeof properties[prop] === "string"
      ) {
        label += `<em>${prop}</em>: ${properties[prop]}`;

        break;
      }
    }
  }

  const li = document.createElement("li");

  li.innerHTML = label;
  li.addEventListener("click", () => {
    displayDetails(title, feature, li);

    marker.setGeometry(feature.getGeometry());
    markerLayer.setVisible(true);
  });

  olElement.append(li);
}
