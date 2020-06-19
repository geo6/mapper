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

export default function () {
  map.addLayer(geocoderLayer);

  $("#geocoder").on("submit", (event) => {
    event.preventDefault();

    const search = $("#geocoder-search").val().trim();

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

  $('#info-location a[href="#reverse-geocode"]').on("click", (event) => {
    event.preventDefault();

    const { longitude, latitude } = $(event.currentTarget).data();

    $("#geocoder-search").val(
      `${Math.round(longitude * 1000000) / 1000000}, ${
        Math.round(latitude * 1000000) / 1000000
      }`
    );

    geocodeReverse(longitude, latitude);

    sidebar.open("geocoder");
  });
}
