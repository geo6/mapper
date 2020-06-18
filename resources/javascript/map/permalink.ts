"use strict";

import { Coordinate } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";

import { cache, map } from "../main";

export function getFromHash(): {
  center: Coordinate | null;
  zoom: number | null;
} {
  let zoom = null;
  let center = null;

  if (window.location.hash !== "") {
    const hash = window.location.hash.replace("#map=", "");
    const parts = hash.split("/");

    if (parts.length === 3) {
      zoom = parseInt(parts[0], 10);
      center = fromLonLat([parseFloat(parts[2]), parseFloat(parts[1])]);
    }
  }

  return { center, zoom };
}

export function getFromCache(): {
  center: Coordinate | null;
  zoom: number | null;
} {
  let zoom = null;
  let center = null;

  if (typeof cache.map !== "undefined" && cache.map !== null) {
    zoom = cache.map.zoom;
    center = fromLonLat([cache.map.longitude, cache.map.latitude]);
  }

  return { center, zoom };
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
