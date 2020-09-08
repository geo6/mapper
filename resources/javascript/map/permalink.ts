"use strict";

import { Coordinate } from "ol/coordinate";
import { toLonLat } from "ol/proj";

import CacheParams from "../_interface/CacheParams";

import { cache, map } from "../main";

export function getFromHash(): CacheParams {
  let baselayer: string | null = null;
  let coordinate: Coordinate | null = null;
  let zoom: number | null = null;

  if (window.location.hash !== "") {
    const params: { map?: string; baselayer?: string } = {};
    window.location.hash
      .substr(1)
      .split("&")
      .forEach((param) => {
        const [key, value] = param.split("=");

        params[key] = value;
      });

    if (typeof params.map !== "undefined") {
      const parts = params.map.split("/");

      if (parts.length === 3) {
        coordinate = [parseFloat(parts[2]), parseFloat(parts[1])];
        zoom = parseInt(parts[0], 10);
      }
    }

    if (typeof params.baselayer !== "undefined") {
      baselayer = params.baselayer;
    }
  }

  return { baselayer, coordinate, zoom };
}

export function init(): void {
  const view = map.getView();

  let shouldUpdate = true;

  map.on("moveend", () => {
    if (!shouldUpdate) {
      // do not update the URL when the view was changed in the 'popstate' handler
      shouldUpdate = true;
      return;
    }

    const center = toLonLat(view.getCenter());
    const longitude = Math.round(center[0] * 1000000) / 1000000;
    const latitude = Math.round(center[1] * 1000000) / 1000000;
    const zoom = view.getZoom();

    const hash = `#map=${zoom}/${latitude}/${longitude}`;
    const state = {
      zoom: view.getZoom(),
      center: view.getCenter(),
    };

    cache.setMap(zoom, longitude, latitude);

    window.history.pushState(state, "map", hash);
  });

  // restore the view state when navigating through the history, see
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
  window.addEventListener("popstate", (event) => {
    if (event.state === null) {
      return;
    }

    map.getView().setCenter(event.state.center);
    map.getView().setZoom(event.state.zoom);

    shouldUpdate = false;
  });
}
