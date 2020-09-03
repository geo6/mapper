"use strict";

import "ol/ol.css";

import $ from "jquery";

import {
  defaults as ControlDefaults,
  Attribution,
  ScaleLine,
} from "ol/control";
import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import View from "ol/View";

import initDraw from "./draw";
import initGeocoder from "./geocoder";
import initInfo from "./info";
import GeolocationControl from "./map/control/GeolocationControl";
import MeasureControl from "./map/control/MeasureControl";
import {
  init as initPermalink,
  getFromCache,
  getFromHash,
} from "./map/permalink";
import singleClick from "./map/singleclick";
import BaseLayer from "./BaseLayer";
import BaseLayerOptions from "./_interface/BaseLayerOptions";

import { cache } from "./main";
import { markerLayer } from "./map/marker";
import { layerGroup } from "./map/layerGroup";

export default function (
  lnglat: Coordinate,
  zoom: number,
  _baselayers: Record<string, BaseLayerOptions>
): Map {
  $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  $(window).on("resize", () => {
    $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  });

  let view = getFromHash();
  if (view.zoom === null || view.center === null) {
    view = getFromCache();
  }
  if (view.zoom === null || view.center === null) {
    view = {
      center: fromLonLat(lnglat),
      zoom,
    };
  }

  const map = new Map({
    target: "map",
    controls: ControlDefaults({
      attribution: false,
    }).extend([
      new Attribution({
        collapsible: false,
      }),
      new ScaleLine(),
      new GeolocationControl(),
      new MeasureControl(),
    ]),
    layers: [],
    view: new View({
      center: view.center,
      constrainResolution: true,
      zoom: view.zoom,
    }),
  });

  const baselayers = {};
  Object.keys(_baselayers).forEach((key: string) => {
    baselayers[key] = new BaseLayer(map, cache, key, _baselayers[key]);
  });

  const baselayer = cache.baselayer || Object.keys(_baselayers)[0];
  baselayers[baselayer].highlight().addToMap();

  map.addLayer(layerGroup);

  map.once("rendercomplete", () => {
    map.on("singleclick", (event) => singleClick(event));

    initPermalink();
    initInfo();
    initGeocoder();
    initDraw();

    map.addLayer(markerLayer);
  });

  return map;
}
