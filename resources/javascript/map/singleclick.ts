"use strict";

import { MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";

import displayLocation from "../info/location";

import { files, services } from "../main";
import { drawControl } from "../draw";
import { marker, markerLayer } from "./marker";

export default function (event: MapBrowserEvent): void {
  marker.setGeometry(null);
  markerLayer.setVisible(false);

  displayLocation(event.coordinate);

  document.getElementById("info-location").hidden = false;
  document.getElementById("info-list").hidden = false;
  document.getElementById("info-list").innerHTML = "";
  document.getElementById("info-details").hidden = true;

  document.querySelector("#info-details > table > caption").innerHTML = "";
  document.querySelector("#info-details > table > tbody").innerHTML = "";

  document.getElementById("info-details-geometry").innerHTML = "";
  document.getElementById("info-details-geometry").hidden = false;

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

  let count = 0;

  // Draw
  const features = drawControl.getFeatureInfo(event.coordinate);
  if (features !== null && features.length > 0) {
    count += features.length;

    drawControl.displayFeaturesList(features);
  }

  // CSV
  files.csv.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      count += features.length;

      file.displayFeaturesList(index, features);
    }
  });

  // GeoJSON
  files.geojson.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      count += features.length;

      file.displayFeaturesList(index, features);
    }
  });

  // GPX
  files.gpx.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      count += features.length;

      file.displayFeaturesList(index, features);
    }
  });

  // KML
  files.kml.forEach((file, index) => {
    const features = file.getFeatureInfo(event.coordinate);

    file.selection = features;

    if (features !== null && features.length > 0) {
      count += features.length;

      file.displayFeaturesList(index, features);
    }
  });

  // WMS
  const requests = [];
  services.wms.forEach(async (service) => {
    if (service.olLayer !== null) {
      requests.push(service.getFeatureInfo(event.coordinate));
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

  Promise.all(requests).then((results: FeatureLike[][]) => {
    count += results.reduce(
      (accumulator, currentValue) => accumulator + currentValue.length,
      0
    );

    if (count === 1) {
      document
        .querySelector("#info-list .info-list-feature")
        .dispatchEvent(new Event("click"));
    }
  });
}
