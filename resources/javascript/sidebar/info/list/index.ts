"use strict";

import { containsExtent } from "ol/extent";
import Feature from "ol/Feature";

import File from "../../../layers/File";
import createFeatureLI from "./feature";
import createFeatureDetails from "./feature/details";
import createButtonsElement from "./feature/details/buttons";

import { map } from "../../../main";
import { marker, markerLayer } from "../../../map/marker";

function showOnMap (feature: Feature): void {
  marker.setGeometry(feature.getGeometry());
  markerLayer.setVisible(true);

  if (containsExtent(map.getView().calculateExtent(), feature.getGeometry().getExtent()) !== true) {
    map.getView().fit(feature.getGeometry().getExtent(), {
      maxZoom: 18,
      padding: [15, 15, 15, 15],
    });
  }
}

export default function (file: File, features: Feature[], targets: { list: HTMLElement; details: HTMLElement; }): HTMLLIElement {
  const li = document.createElement('li');

  li.innerHTML = `<strong>${file.title || file.name}</strong>`;

  const ol = document.createElement("ol");

  features.forEach((feature) => {
    const li = createFeatureLI(feature, file);

    li.addEventListener("click", () => {
      const details = createFeatureDetails(feature);

      const items = targets.list.querySelectorAll("ol > li");
      const current = Array.from(items).indexOf(li);

      targets.list.hidden = true;

      const titleElement = document.createElement("div");
      titleElement.innerHTML = `<strong>${file.title || file.name}</strong>`;

      targets.details.innerHTML = "";
      targets.details.hidden = false;
      targets.details.dataset.current = current.toString();

      targets.details.append(createButtonsElement(feature.getGeometry(), targets));
      targets.details.append(titleElement);
      targets.details.append(...details);

      showOnMap(feature);
    });

    ol.append(li);
  });

  li.append(ol);

  return li;
}