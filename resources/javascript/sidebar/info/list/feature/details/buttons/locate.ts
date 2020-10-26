"use strict";

import { Geometry } from "ol/geom";

import { map } from "../../../../../../main";

export default function (geometry: Geometry): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-sm float-right";
  button.innerHTML = '<i class="fas fa-location-arrow"></i> Locate';
  button.type = "button";

  button.addEventListener("click", () => {
    map.getView().fit(geometry.getExtent(), {
      maxZoom: 18,
      padding: [15, 15, 15, 15],
    });
  });

  return button;
}