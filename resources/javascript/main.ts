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

export let baselayers: Record<string, {}>;
export let baseUrl: string;
export let cache: Cache;
export let customKey: string | null;
export let https: boolean;
export let map: Map;
export let sidebar: Sidebar;
export let modalSettings: SettingsModal;
export let providers: Record<string, {}>;

window.app = window.app || {};

export function setBaseUrl(url: string, isHttps: boolean): void {
  baseUrl = url;
  https = isHttps;
}

export function setCustomKey(key: string): void {
  customKey = key;
}

export function setProviders(_providers: Record<string, {}>): void {
  providers = _providers;
}

export function setMap(
  _baselayers: Record<string, {}>,
  lnglat: Coordinate,
  zoom: number
) {
  baselayers = _baselayers;
  cache = new Cache();

  initProj4();

  map = initMap(lnglat, zoom);
  initLayers();
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
