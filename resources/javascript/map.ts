"use strict";

import "ol/ol.css";

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
import initBaselayers from "./map/baselayers";
import GeolocationControl from "./map/geolocation";
import initMarker from "./map/marker";
import MeasureControl from "./map/measure/control";
import initPermalink from "./map/permalink";
import initSingleClick from "./map/singleclick";

export default function (lnglat: Coordinate, zoom: number): Map {
  $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  $(window).on("resize", () => {
    $("#map").height($(window).height() - $("body > nav.navbar").outerHeight());
  });

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
      center: fromLonLat(lnglat),
      zoom,
    }),
  });

  map.once("rendercomplete", () => {
    initPermalink();
    initSingleClick();
    initInfo();
    initBaselayers();
    initMarker();
    initGeocoder();
    initDraw();
  });

  return map;
}
