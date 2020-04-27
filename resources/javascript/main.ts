"use strict";

import "../sass/style.scss";

import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import Cache from "./Cache";
import initMap from "./map";
import initLayers from "./map/layers";
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
export let projections: Record<string, {}>;
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

export function addProjections(_projections: Record<string, {}>): void {
  projections = _projections;

  for (const epsg in projections) {
    proj4.defs(epsg, projections[epsg].proj4);
  }

  register(proj4);
}

export function setMap(
  _baselayers: Record<string, {}>,
  layers: Array<{}>,
  files: Record<string, Array<{}>>,
  lnglat: Coordinate,
  zoom: number
) {
  baselayers = _baselayers;
  cache = new Cache();

  map = initMap(lnglat, zoom);
  initLayers(layers, files);
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
