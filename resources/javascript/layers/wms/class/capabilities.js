"use strict";

import WMSCapabilities from "ol/format/WMSCapabilities";

import { baseUrl, customKey, https, map } from "../../../main";

function parseLayers(layers, searchElements) {
  let results = [];

  if (Array.isArray(layers)) {
    for (let i = 0; i < layers.length; i++) {
      if (typeof layers[i].Layer !== "undefined") {
        results = results.concat(parseLayers(layers[i].Layer, searchElements));
      } else if (
        typeof searchElements !== "undefined" &&
        searchElements.indexOf(layers[i].Name) > -1
      ) {
        results.push(layers[i]);
      } else if (typeof searchElements === "undefined") {
        results.push(layers[i]);
      }
    }
  } else {
    results.push(layers);
  }

  return results;
}

export default function(origUrl) {
  const url =
    `${baseUrl}proxy` +
    "?" +
    $.param({
      c: customKey,
      SERVICE: "WMS",
      REQUEST: "GetCapabilities",
      VERSION: "1.3.0",
      _url: origUrl
    });
  return fetch(url)
    .then((response) => response.text())
    .then((response) => {
      const capabilities = new WMSCapabilities().read(response);

      let projection = map.getView().getProjection().getCode();
      if (
        typeof capabilities.Capability.Layer.CRS !== "undefined" &&
        capabilities.Capability.Layer.CRS.indexOf(projection) === -1
      ) {
        const crs = capabilities.Capability.Layer.CRS;

        projection = crs.find(
          (crs) =>
            [
              "EPSG:900913",
              "EPSG:3587",
              "EPSG:54004",
              "EPSG:41001",
              "EPSG:102113",
              "EPSG:102100",
              "EPSG:3785"
            ].indexOf(crs) !== -1
        );

        if (typeof projection === "undefined") {
          throw new Error(
            `The WMS service "${origUrl}" does not support ${projection} !` +
              `It supports only ${crs.join(", ")}.`
          );
        }
      }

      return {
        capabilities: capabilities,
        layers:
          typeof capabilities.Capability.Layer.Layer !== "undefined"
            ? parseLayers(capabilities.Capability.Layer.Layer)
            : parseLayers(capabilities.Capability.Layer),
        mixedContent:
          https === true &&
          RegExp("^http://").test(capabilities.Service.OnlineResource),
        projection
      };
    });
}
