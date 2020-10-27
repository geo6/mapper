"use strict";

import createLI from "../info/list";
import search from "./searchString";

import { files } from "../../main";
import { marker, markerLayer } from "../../map/marker";
import { drawControl } from "../draw";

export default function (): void {
  document
    .getElementById("search-form")
    .addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const value = (document.getElementById(
        "search-search"
      ) as HTMLInputElement).value;

      const listElement = document.getElementById("search-list");
      const detailsElement = document.getElementById("search-details");

      listElement.innerHTML = "";
      listElement.hidden = false;
      detailsElement.innerHTML = "";
      detailsElement.hidden = true;

      marker.setGeometry(null);
      markerLayer.setVisible(false);

      // Draw
      const features = search(drawControl.olLayer, value);
      if (features.length > 0) {
        listElement.append(
          createLI("Draw", features, {
            list: listElement,
            details: detailsElement,
          })
        );
      }

      // Files
      files.csv
        .filter((file) => file.olLayer !== null)
        .forEach((file) => {
          const features = search(file.olLayer, value, file.filter);
          if (features.length > 0) {
            listElement.append(
              createLI(
                file.title || file.name,
                features,
                {
                  list: listElement,
                  details: detailsElement,
                },
                file.label
              )
            );
          }
        });
      files.geojson
        .filter((file) => file.olLayer !== null)
        .forEach((file) => {
          const features = search(file.olLayer, value, file.filter);
          if (features.length > 0) {
            listElement.append(
              createLI(
                file.title || file.name,
                features,
                {
                  list: listElement,
                  details: detailsElement,
                },
                file.label
              )
            );
          }
        });
      files.gpx
        .filter((file) => file.olLayer !== null)
        .forEach((file) => {
          const features = search(file.olLayer, value, file.filter);
          if (features.length > 0) {
            listElement.append(
              createLI(
                file.title || file.name,
                features,
                {
                  list: listElement,
                  details: detailsElement,
                },
                file.label
              )
            );
          }
        });
      files.kml
        .filter((file) => file.olLayer !== null)
        .forEach((file) => {
          const features = search(file.olLayer, value, file.filter);
          if (features.length > 0) {
            listElement.append(
              createLI(
                file.title || file.name,
                features,
                {
                  list: listElement,
                  details: detailsElement,
                },
                file.label
              )
            );
          }
        });
    });
}
