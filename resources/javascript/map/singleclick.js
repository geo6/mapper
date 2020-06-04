"use strict";

import displayLocation from "../info/location";

import { files, map } from "../main";
import { marker, markerLayer } from "./marker";

export default function() {
  map.on("singleclick", (event) => {
    marker.setGeometry(null);
    markerLayer.setVisible(false);

    displayLocation(event.coordinate);

    $("#info-list").empty().show();
    $("#info-details").hide();
    $("#info-details > table > caption, #info-details > table > tbody").empty();
    $("#info-details-geometry").empty().hide();

    $("#infos-list-btn-prev, #infos-list-btn-next").prop("disabled", true);
    $("#infos-details-btn-locate").off().prop("disabled", true);

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
    window.app.wms.forEach((service) => {
      if (service.olLayer !== null) {
        service.getFeatureInfo(event.coordinate);
      }
    });

    // WMTS
    window.app.wmts.forEach((service) => {
      const getfeatureinfo =
        typeof service.capabilities.OperationsMetadata.GetFeatureInfo !==
        "undefined";

      if (getfeatureinfo === true && Object.keys(service.olLayers).length > 0) {
        service.getFeatureInfo(event.coordinate);
      }
    });
  });
}
