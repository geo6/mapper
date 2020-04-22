"use strict";

import "ol/ol.css";

import "../sass/style.scss";

import { Cache } from "./cache";
import initMap from "./map";
import initLayers from "./map/layers";
import initProj4 from "./proj4";
import initUpload from "./upload";
import { Sidebar } from "./sidebar";
import { SettingsModal } from "./modal/settings";

export let cache: Cache;
export let sidebar: Sidebar;
export let modalSettings: SettingsModal;

window.app = window.app || {};

export function init() {
  cache = new Cache();

  initProj4();

  initMap();
  initLayers();
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
