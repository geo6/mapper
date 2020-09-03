"use strict";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import geocodeAddress from "./geocoder/address";
import geocodeReverse from "./geocoder/reverse";

import { map, sidebar } from "./main";

export const geocoderLayer = new VectorLayer({
  source: new VectorSource(),
  visible: false,
  zIndex: Infinity,
});

export default function (): void {
  map.addLayer(geocoderLayer);

  const element = document.getElementById(
    "geocoder-search"
  ) as HTMLInputElement;

  document
    .getElementById("geocoder")
    .addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const search = element.value.trim();

      const matchesLngLat = /^([0-9.]+) *, *([0-9.]+)$/.exec(search);

      if (matchesLngLat !== null) {
        geocodeReverse(
          parseFloat(matchesLngLat[1]),
          parseFloat(matchesLngLat[2])
        );
      } else {
        geocodeAddress(search);
      }
    });

  document
    .querySelector('#info-location a[href="#reverse-geocode"]')
    .addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();

      const longitude = parseFloat(
        (event.currentTarget as HTMLLinkElement).dataset.longitude
      );
      const latitude = parseFloat(
        (event.currentTarget as HTMLLinkElement).dataset.latitude
      );

      element.value =
        `${Math.round(longitude * 1000000) / 1000000}` +
        "," +
        `${Math.round(latitude * 1000000) / 1000000}`;

      geocodeReverse(longitude, latitude);

      sidebar.open("geocoder");
    });
}
