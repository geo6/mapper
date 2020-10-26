"use strict";

import createLI from "../info/list";
import search from "./searchString";

import { files } from "../../main";
import { marker, markerLayer } from "../../map/marker";

export default function () {
  document
    .getElementById("search-form")
    .addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const value = (document.getElementById("search-search") as HTMLInputElement).value;

      const listElement = document.getElementById("search-list");
      const detailsElement = document.getElementById("search-details");

      listElement.innerHTML = "";
      listElement.hidden = false;
      detailsElement.innerHTML = "";
      detailsElement.hidden = true;

      marker.setGeometry(null);
      markerLayer.setVisible(false);

      files.csv
        .filter(file => file.olLayer !== null)
        .forEach(file => {
          const features = search(file.olLayer.getSource(), value, file.filter);
          if (features.length > 0) {
            listElement.append(createLI(file, features, { list: listElement, details: detailsElement }));
          }
        });
      files.geojson
        .filter(file => file.olLayer !== null)
        .forEach(file => {
          const features = search(file.olLayer.getSource(), value, file.filter);
          if (features.length > 0) {
            listElement.append(createLI(file, features, { list: listElement, details: detailsElement }));
          }
        });
      files.gpx
        .filter(file => file.olLayer !== null)
        .forEach(file => {
          const features = search(file.olLayer.getSource(), value, file.filter);
          if (features.length > 0) {
            listElement.append(createLI(file, features, { list: listElement, details: detailsElement }));
          }
        });
      files.kml
        .filter(file => file.olLayer !== null)
        .forEach(file => {
          const features = search(file.olLayer.getSource(), value, file.filter);
          if (features.length > 0) {
            listElement.append(createLI(file, features, { list: listElement, details: detailsElement }));
          }
        });
    });
}