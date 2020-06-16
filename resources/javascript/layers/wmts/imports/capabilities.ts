"use strict";

import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { ProjectionLike } from "ol/proj";

import { baseUrl, customKey, https, map } from "../../../main";

function parseLayers(layers: unknown): unknown[] {
  const results = [];

  if (Array.isArray(layers)) {
    layers.forEach((layer) => {
      results.push(layer);
    });
  } else {
    results.push(layers);
  }

  return results;
}

export default async function (
  origUrl: string
): Promise<{
  capabilities: WMTSCapabilities;
  layers: unknown[];
  mixedContent: boolean;
  projection: ProjectionLike;
}> | null {
  const url =
    `${baseUrl}proxy` +
    "?" +
    new URLSearchParams({
      c: customKey,
      SERVICE: "WMTS",
      REQUEST: "GetCapabilities",
      VERSION: "1.0.0",
      _url: origUrl,
    }).toString();

  const response = await fetch(url);
  if (response.ok !== true) return null;

  const text = await response.text();

  const capabilities = new WMTSCapabilities().read(text);

  const crs = [];
  for (let m = 0; m < capabilities.Contents.TileMatrixSet.length; m++) {
    const supportedCRS = capabilities.Contents.TileMatrixSet[
      m
    ].SupportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, "$1:$3");

    crs.push(supportedCRS);
  }

  let projection = map.getView().getProjection().getCode();

  if (crs.indexOf(projection) === -1) {
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
      throw new Error(
        `The WMTS service "${origUrl}" does not support ${projection} !` +
          `It supports only ${crs.join(", ")}.`
      );
    }
  }
  return {
    capabilities: capabilities,
    layers: parseLayers(capabilities.Contents.Layer),
    mixedContent: https === true && RegExp("^http://").test(origUrl),
    projection,
  };
}
