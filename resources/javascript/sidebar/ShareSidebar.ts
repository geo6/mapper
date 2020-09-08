"use strict";

import { Coordinate, toStringXY } from "ol/coordinate";
import { toLonLat } from "ol/proj";

import { map, cache } from "../main";

class ShareSidebar {
  private static getCoordinates(): Coordinate {
    return toLonLat(map.getView().getCenter());
  }

  private static getZoomLevel(): number {
    return map.getView().getZoom();
  }

  private static getBaseLayer(): string {
    return cache.baselayer;
  }

  update(): void {
    const coordinate = ShareSidebar.getCoordinates();
    const zoom = ShareSidebar.getZoomLevel();
    const baselayer = ShareSidebar.getBaseLayer();

    const coordinates = toStringXY(coordinate, 6);
    const longitude = Math.round(coordinate[0] * 1000000) / 1000000;
    const latitude = Math.round(coordinate[1] * 1000000) / 1000000;

    document.getElementById("share-coordinate").innerText = coordinates;
    document.getElementById("share-zoom").innerText = zoom.toString();
    document.getElementById("share-baselayer").innerText = baselayer;

    const params = {
      map: `${zoom}/${latitude}/${longitude}`,
      baselayer,
    };

    const url = new URL(window.location.href);

    url.hash = Object.keys(params)
      .map((key: string) => `${key}=${params[key]}`)
      .join("&");

    document.getElementById("share-url").innerText = url.toString();
  }
}

export { ShareSidebar as default };
