"use strict";

import { MapBrowserEvent } from "ol";

import displayLocation from "../info/location";

import { files, services } from "../main";
import { marker, markerLayer } from "./marker";

export default function (event: MapBrowserEvent): void {
  marker.setGeometry(null);
  markerLayer.setVisible(false);

  displayLocation(event.coordinate);

  document.getElementById("info-list").innerHTML = "";
  document.getElementById("info-list").style.display = "";

  document.getElementById("info-details").style.display = "none";

  document.querySelector("#info-details > table > caption").innerHTML = "";
  document.querySelector("#info-details > table > tbody").innerHTML = "";

  document.getElementById("info-details-geometry").innerHTML = "";
  document.getElementById("info-details-geometry").style.display = "";

  (document.getElementById(
    "infos-list-btn-prev"
  ) as HTMLButtonElement).disabled = true;
  (document.getElementById(
    "infos-list-btn-next"
  ) as HTMLButtonElement).disabled = true;

  (document.getElementById(
    "infos-details-btn-locate"
  ) as HTMLButtonElement).disabled = true;

  $("#infos-details-btn-locate").off();

  // Draw
  const features = window.app.draw.getFeatureInfo(event.coordinate);
  if (features !== null && features.length > 0) {
    window.app.draw.displayFeaturesList(features);
  }

  // CSV
  files.csv.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      file.displayFeaturesList(index, features);
    }
  });

  // GeoJSON
  files.geojson.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      file.displayFeaturesList(index, features);
    }
  });

  // GPX
  files.gpx.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      file.displayFeaturesList(index, features);
    }
  });

  // KML
  files.kml.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      file.displayFeaturesList(index, features);
    }
  });

  // WMS
  services.wms.forEach((service) => {
    if (service.olLayer !== null) {
      service.getFeatureInfo(event.coordinate);
    }
  });

  // WMTS
  // services.wmts.forEach((service) => {
  //   const getfeatureinfo =
  //     typeof service.capabilities.OperationsMetadata.GetFeatureInfo !==
  //     "undefined";

  //   if (getfeatureinfo === true && Object.keys(service.olLayers).length > 0) {
  //     service.getFeatureInfo(event.coordinate);
  //   }
  // });
}
