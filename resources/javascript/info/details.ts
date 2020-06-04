"use strict";

import Feature from "ol/Feature";

import displayGeometry from "./geometry";
import { check as checkURL, display as displayURL } from "./details/url";
import { check as checkFile, display as displayFile } from "./details/file";

const hidden: string[] = [
  "boundedBy",
  "color",
  "fill",
  "fill-color",
  "fill-opacity",
  "marker-color",
  "marker-size",
  "marker-symbol",
  "stroke",
  "stroke-color",
  "stroke-width",
  "stroke-opacity"
];

/**
 * Display details of a feature in the sidebar.
 *
 * @param string        title     Layer title.
 * @param Feature       feature   Feature object.
 * @param HTMLLIElement liElement Clicked li DOM element in the features list.
 */
export default function(
  title: string,
  feature: Feature,
  liElement: HTMLLIElement
): void {
  $("#info-list").hide();
  $("#info-details").show();

  $("#info-details > table > caption, #info-details > table > tbody").empty();
  $("#info-details-geometry").empty().hide();

  const items = document.querySelectorAll("#info-list ol > li");
  const current = Array.from(items).indexOf(liElement);

  document.getElementById("info-details").dataset.current = current.toString();

  const btnPrevious = document.getElementById(
    "infos-list-btn-prev"
  ) as HTMLButtonElement;
  const btnNext = document.getElementById(
    "infos-list-btn-next"
  ) as HTMLButtonElement;

  btnPrevious.disabled = true;
  btnNext.disabled = true;

  if (current - 1 >= 0) {
    btnPrevious.disabled = false;
  }
  if (current + 1 < items.length) {
    btnNext.disabled = false;
  }

  const titleFormatted = title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1");
  const id = feature.getId();

  const captionElement = document.querySelector(
    "#info-details > table > caption"
  );
  captionElement.innerHTML = `<strong>${titleFormatted}</strong>`;
  if (typeof id !== "undefined") {
    captionElement.innerHTML += `<br><br><i class="fas fa-bookmark"></i> Feature id: ${id}</strong>`;
  }

  const properties = feature.getProperties();
  Object.keys(properties).forEach((key: string) => {
    if (key === feature.getGeometryName() || hidden.indexOf(key) > -1) {
      return;
    }

    const value = properties[key] || null;

    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.innerText = key;
    tr.append(th);

    const td = document.createElement("td");

    if (value === null) {
      td.className = "text-muted font-italic";
      td.innerText = "NULL";
    } else {
      if (checkURL(value) !== false) {
        const url = displayURL(value);

        td.append(url);
      } else if (checkFile(value) !== false) {
        td.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i>";

        displayFile(value).then((file: HTMLAnchorElement | string) => {
          td.innerHTML = "";
          td.append(file);
        });
      } else {
        td.innerText = value.toString();
      }
    }

    tr.append(td);

    document.querySelector("#info-details > table > tbody").append(tr);
  });

  const geometry = feature.getGeometry();

  if (typeof geometry !== "undefined") {
    displayGeometry(geometry);
  }
}
