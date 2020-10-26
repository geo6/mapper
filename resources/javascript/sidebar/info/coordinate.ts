"use strict";

import { toLonLat } from "ol/proj";
import { toStringXY, Coordinate } from "ol/coordinate";

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
}
