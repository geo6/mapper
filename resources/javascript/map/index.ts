"use strict";

import "ol/ol.css";

import {
  defaults as ControlDefaults,
  Attribution,
  ScaleLine,
} from "ol/control";
import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";

import initDraw from "../sidebar/draw";
import initGeocoder from "../geocoder";
import initInfo from "../sidebar/info";
import GeolocationControl from "./control/GeolocationControl";
import MapExportControl from "./control/MapExportControl";
import MeasureControl from "./control/MeasureControl";
import { init as initPermalink, getFromCache, getFromHash } from "./permalink";
import BaseLayer from "../BaseLayer";
import BaseLayerOptions from "../_interface/BaseLayerOptions";

import { cache } from "../main";
import { markerLayer } from "./marker";
import { layerGroupFiles, layerGroupServices } from "./layerGroup";

export default function (
  lnglat: Coordinate,
  zoom: number,
  _baselayers: Record<string, BaseLayerOptions>
): Map {
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
      new MapExportControl(),
      new MeasureControl(),
    ]),
    layers: [],
  });

  const view =
    getFromHash(map) ??
    getFromCache() ??
    new View({ center: fromLonLat(lnglat), zoom });
  map.setView(view);

  const baselayers = {};
  Object.keys(_baselayers).forEach((key: string) => {
    baselayers[key] = new BaseLayer(map, cache, key, _baselayers[key]);
  });

  if (typeof baselayers[cache.baselayer] !== 'undefined') {
    baselayers[cache.baselayer].highlight().addToMap();
  } else {
    const baselayer = Object.keys(_baselayers)[0];
    baselayers[baselayer].highlight().addToMap();
  }

  map.addLayer(layerGroupFiles);
  map.addLayer(layerGroupServices);

  map.once("rendercomplete", () => {
    initPermalink();
    initInfo();
    initGeocoder();
    initDraw();

    map.addLayer(markerLayer);
  });

  return map;
}
