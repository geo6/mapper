"use strict";

import GeoJSON from "ol/format/GeoJSON";

import { baseUrl, customKey, map, providers } from "../main";
import { geocoderLayer } from "../geocoder";

/**
 * Launch reverse geocoding query on every API configured and display result in sidebar.
 *
 * @param {float} longitude Longitude sent to APIs.
 * @param {float} latitude  Latitude sent to APIs.
 *
 * @returns {void}
 */
export default async function (
  longitude: number,
  latitude: number
): Promise<void> {
  geocoderLayer.getSource().clear();

  document.getElementById("geocoder-results").innerHTML = "";

  for (const key in providers) {
    const provider = providers[key];

    if (provider.reverse === false) {
      continue;
    }

    const div = document.createElement("div");
    div.id = `geocoder-results-${key}`;
    div.innerHTML =
      `Results from <strong>${provider.title}</strong>` +
      '<div class="loading text-muted"><i class="fas fa-spinner fa-spin"></i> Loading ...</div>' +
      "<hr>";
    document.getElementById("geocoder-results").append(div);

    const url =
      `${baseUrl}geocoder/${key}/reverse/${longitude}/${latitude}` +
      "?" +
      new URLSearchParams({
        c: customKey,
      }).toString();

    const response = await fetch(url);

    if (response.ok !== true) {
      document.getElementById(`geocoder-results-${key}`).remove();
    } else {
      const geojson = await response.json();

      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: map.getView().getProjection(),
      });

      geocoderLayer.getSource().addFeatures(features);
      geocoderLayer.setVisible(true);

      if (features.length > 0) {
        const ol = document.createElement("ol");

        features.forEach((feature) => {
          const { formattedAddress } = feature.getProperties();

          const li = document.createElement("li");
          li.innerText = formattedAddress;
          li.addEventListener("click", () => {
            map.getView().fit(feature.getGeometry(), {
              maxZoom: 18,
              padding: [15, 15, 15, 15],
            });
          });

          ol.append(li);
        });

        document
          .querySelector(`#geocoder-results-${key} > .loading`)
          .replaceWith(ol);

        if (provider.attribution !== null) {
          const div = document.createElement("div");
          div.classList.add("small", "text-right", "text-muted");
          div.innerHTML = provider.attribution;

          ol.after(div);
        }
      } else {
        document.getElementById(`geocoder-results-${key}`).remove();
      }
    }
  }
}
