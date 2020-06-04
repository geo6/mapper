"use strict";

import "ol/ol.css";

import {
  defaults as ControlDefaults,
  Attribution,
  ScaleLine
} from "ol/control";
import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import View from "ol/View";

import initDraw from "./draw";
import initGeocoder from "./geocoder";
import initInfo from "./info";
import GeolocationControl from "./map/geolocation";
import MeasureControl from "./map/measure/control";
import initPermalink from "./map/permalink";
import initSingleClick from "./map/singleclick";
import BaseLayer from "./BaseLayer";
import BaseLayerOptions from "./BaseLayerOptions";

import { cache } from "./main";
import { markerLayer } from "./map/marker";

export default function(
  lnglat: Coordinate,
  zoom: number,
  _baselayers: Record<string, BaseLayerOptions>
): Map {
  $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  $(window).on("resize", () => {
    $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  });

  const map = new Map({
    target: "map",
    controls: ControlDefaults({
      attribution: false
    }).extend([
      new Attribution({
        collapsible: false
      }),
      new ScaleLine(),
      new GeolocationControl(),
      new MeasureControl()
    ]),
    layers: [],
    view: new View({
      center: fromLonLat(lnglat),
      constrainResolution: true,
      zoom
    })
  });

  const baselayers = {};
  Object.keys(_baselayers).forEach((key: string) => {
    baselayers[key] = new BaseLayer(map, cache, key, _baselayers[key]);
  });

  const baselayer = cache.baselayer || Object.keys(_baselayers)[0];
  baselayers[baselayer].highlight().addToMap();

  map.once("rendercomplete", () => {
    initPermalink();
    initSingleClick();
    initInfo();
    initGeocoder();
    initDraw();

    map.addLayer(markerLayer);
  });

  return map;
}
