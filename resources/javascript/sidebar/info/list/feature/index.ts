"use strict";

import Feature from "ol/Feature";

import File from "../../../../layers/File";
import getLabel from "./label";

// import { map } from "../../../../main";

export default function (
  feature: Feature,
  file: File,
): HTMLLIElement {
  const li = document.createElement("li");

  li.className = "info-list-feature";

  if (feature.getGeometry() !== null) {
    li.innerHTML += '<i class="fas fa-fw fa-vector-square"></i>' + ' ';
  };

  li.innerHTML += getLabel(feature, file.label);

  // const locate = document.createElement("a");
  // locate.href = "#";
  // locate.style.color = "inherit";
  // locate.className = "float-right";
  // locate.innerHTML = '<i class="fas fa-location-arrow"></i>';
  // locate.title = 'Locate';

  // locate.addEventListener("click", (event: Event) => {
  //   event.preventDefault();

  //   map.getView().fit(feature.getGeometry().getExtent(), {
  //     maxZoom: 18,
  //     padding: [15, 15, 15, 15],
  //   });
  // });

  // li.append(locate);

  return li;
}