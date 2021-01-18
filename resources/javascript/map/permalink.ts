"use strict";

import { Map, View } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";

import { cache, map } from "../main";

export function getFromHash (map: Map): View {
  let view = null;

  const matchZoomCenter = window.location.hash.match(/#map=(\d+)\/([\d.]+)\/([\d.]+)$/);
  const matchBBox = window.location.hash.match(/#bbox=([\d.]+),([\d.]+),([\d.]+),([\d.]+)$/);

  if (matchZoomCenter !== null) {
    const zoom = parseInt(matchZoomCenter[1], 10);
    const center = fromLonLat([parseFloat(matchZoomCenter[3]), parseFloat(matchZoomCenter[2])]);

    view = new View({
      center,
      constrainResolution: true,
      zoom,
    });
  } else if (matchBBox !== null) {
    view = new View({
      constrainResolution: true
    });

    const min = fromLonLat([
      parseFloat(matchBBox[1]),
      parseFloat(matchBBox[2]),
    ]);
    const max = fromLonLat([
      parseFloat(matchBBox[3]),
      parseFloat(matchBBox[4]),
    ]);

    view.fit([min[0], min[1], max[0], max[1]], {
      padding: [25, 25, 25, 25],
      size: map.getSize()
    });
  }

  return view;
}

export function getFromCache (): View {
  let view = null;

  if (typeof cache.map !== "undefined" && cache.map !== null) {
    const zoom = cache.map.zoom;
    const center = fromLonLat([cache.map.longitude, cache.map.latitude]);

    view = new View({
      center,
      constrainResolution: true,
      zoom,
    });
  }

  return view;
}

export function init (): void {
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
