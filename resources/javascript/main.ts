"use strict";

import "../sass/style.scss";

import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";

import { Cache } from "./cache";
import initMap from "./map";
import initLayers from "./map/layers";
import initProj4 from "./proj4";
import initUpload from "./upload";
import { Sidebar } from "./sidebar";
import { SettingsModal } from "./modal/settings";

export let cache: Cache;
export let map: Map;
export let sidebar: Sidebar;
export let modalSettings: SettingsModal;

window.app = window.app || {};

export function init(lnglat: Coordinate, zoom: number) {
  cache = new Cache();

  initProj4();

  map = initMap(lnglat, zoom);
  initLayers();
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
