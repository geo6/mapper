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
export default function (longitude, latitude) {
  geocoderLayer.getSource().clear();

  $("#geocoder-results").empty();

  for (const key in providers) {
    const provider = providers[key];

    if (provider.reverse === false) {
      continue;
    }

    $(document.createElement("div"))
      .attr({
        id: `geocoder-results-${key}`,
      })
      .append([
        `Results from <strong>${provider.title}</strong>`,
        '<div class="loading text-muted"><i class="fas fa-spinner fa-spin"></i> Loading ...</div>',
        "<hr>",
      ])
      .appendTo("#geocoder-results");

    const url =
      `${baseUrl}geocoder/${key}/reverse/${longitude}/${latitude}` +
      "?" +
      $.param({ c: customKey });
    fetch(url)
      .then((response) => {
        if (response.ok !== true) {
          $(`#geocoder-results-${key}`).remove();

          return false;
        }

        return response.json();
      })
      .then((geojson) => {
        const features = new GeoJSON().readFeatures(geojson, {
          featureProjection: map.getView().getProjection(),
        });

        geocoderLayer.getSource().addFeatures(features);
        geocoderLayer.setVisible(true);

        if (features.length > 0) {
          const ol = document.createElement("ol");
          features.forEach((feature) => {
            const { formattedAddress } = feature.getProperties();

            $(document.createElement("li"))
              .append(formattedAddress)
              .on("click", () => {
                map.getView().fit(feature.getGeometry(), {
                  maxZoom: 18,
                  padding: [15, 15, 15, 15],
                });
              })
              .appendTo(ol);
          });

          $(`#geocoder-results-${key} > .loading`).replaceWith(ol);

          if (provider.attribution !== null) {
            $(ol).after(
              `<div class="small text-right text-muted">${provider.attribution}</div>`
            );
          }
        } else {
          $(`#geocoder-results-${key}`).remove();
        }
      });
  }
}
