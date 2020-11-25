"use strict";

import { containsExtent } from "ol/extent";
import Feature, { FeatureLike } from "ol/Feature";
import Geometry from "ol/geom/Geometry";

import createFeatureLI from "./feature";
import createFeatureDetails from "./feature/details";
import createButtonsElement from "./feature/details/buttons";

import { map } from "../../../main";
import { marker, markerLayer } from "../../../map/marker";

function showOnMap(feature: Feature): void {
  const geometry = feature.getGeometry();

  if (typeof geometry !== "undefined") {
    marker.setGeometry(geometry);
    markerLayer.setVisible(true);

    if (
      containsExtent(map.getView().calculateExtent(), geometry.getExtent()) !==
      true
    ) {
      map.getView().fit(geometry.getExtent(), {
        maxZoom: 18,
        padding: [15, 15, 15, 15],
      });
    }
  }
}

export default function (
  title: string,
  features: FeatureLike[],
  targets: { list: HTMLElement; details: HTMLElement },
  label?: string
): HTMLLIElement {
  const li = document.createElement("li");

  li.innerHTML = `<strong>${title}</strong>`;

  const ol = document.createElement("ol");

  features.forEach((feature) => {
    const geometry = feature.getGeometry() as Geometry;

    const li = createFeatureLI(feature, label);

    li.addEventListener("click", () => {
      const details = createFeatureDetails(feature);

      const items = targets.list.querySelectorAll("ol > li");
      const current = Array.from(items).indexOf(li);

      targets.list.hidden = true;

      const titleElement = document.createElement("div");
      titleElement.innerHTML = `<strong>${title}</strong>`;

      targets.details.innerHTML = "";
      targets.details.hidden = false;
      targets.details.dataset.current = current.toString();

      targets.details.append(createButtonsElement(geometry, targets));
      targets.details.append(titleElement);
      targets.details.append(...details);

      if (typeof geometry !== "undefined") {
        showOnMap(feature as Feature);
      }
    });

    ol.append(li);
  });

  li.append(ol);

  return li;
}
