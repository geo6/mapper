"use strict";

import { toLonLat } from "ol/proj";
import { toStringXY, Coordinate } from "ol/coordinate";

import { sidebar } from "../main";

/**
 * Display clicked location and open info sidebar.
 *
 * @param {object} coordinates Coordinates object.
 *
 * @returns {void}
 */
export default function (coordinates: Coordinate): void {
  const lonlat = toLonLat(coordinates);

  document.getElementById("info-location-coordinates").innerText = toStringXY(
    lonlat,
    6
  );

  const element = document.querySelector(
    '#info-location a[href="#reverse-geocode"]'
  ) as HTMLLinkElement;
  element.dataset.longitude = lonlat[0].toString();
  element.dataset.latitude = lonlat[1].toString();

  Array.from(document.querySelectorAll(".sidebar-tabs > ul > li"))
    .filter(
      (element: HTMLLIElement) =>
        element.querySelector('a[href="#info"]') !== null
    )[0]
    .classList.remove("disabled");

  sidebar.open("info");
}
