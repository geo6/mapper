"use strict";

import WMSCapabilities from "ol/format/WMSCapabilities";
import { ProjectionLike } from "ol/proj";

import { baseUrl, customKey, https, map } from "../../../main";

function parseLayers(layers: unknown): unknown[] {
  let results = [];

  if (Array.isArray(layers)) {
    layers.forEach((layer) => {
      if (typeof layer.Layer !== "undefined") {
        results = results.concat(parseLayers(layer.Layer));
      } else {
        results.push(layer);
      }
    });
  } else {
    results.push(layers);
  }

  return results;
}

export default async function (
  origUrl: string
): Promise<{
  capabilities: WMSCapabilities;
  layers: unknown[];
  mixedContent: boolean;
  projection: ProjectionLike;
}> | null {
  const url =
    `${baseUrl}proxy` +
    "?" +
    new URLSearchParams({
      c: customKey,
      SERVICE: "WMS",
      REQUEST: "GetCapabilities",
      VERSION: "1.3.0",
      _url: origUrl,
    }).toString();

  const response = await fetch(url);
  if (response.ok !== true) return null;

  const text = await response.text();

  const capabilities = new WMSCapabilities().read(text);

  let projection = map.getView().getProjection().getCode();

  if (
    typeof capabilities.Capability.Layer.CRS !== "undefined" &&
    capabilities.Capability.Layer.CRS.indexOf(projection) === -1
  ) {
    const crs = capabilities.Capability.Layer.CRS;
    projection = crs.find(
      (code: string) =>
        [
          "EPSG:900913",
          "EPSG:3587",
          "EPSG:54004",
          "EPSG:41001",
          "EPSG:102113",
          "EPSG:102100",
          "EPSG:3785",
        ].indexOf(code) !== -1
    );

    if (typeof projection === "undefined") {
      const projection = map.getView().getProjection().getCode();

      throw new Error(
        `The WMS service "${origUrl}" does not support ${projection} !\n` +
          `It supports only ${crs.join(", ")}.`
      );
    }
  }

  return {
    capabilities,
    layers:
      typeof capabilities.Capability.Layer.Layer !== "undefined"
        ? parseLayers(capabilities.Capability.Layer.Layer)
        : parseLayers(capabilities.Capability.Layer),
    mixedContent:
      https === true && /^http:\/\//.test(capabilities.Service.OnlineResource),
    projection,
  };
}
