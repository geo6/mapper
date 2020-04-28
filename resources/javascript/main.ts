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
import Sidebar from "./Sidebar";
import SettingsModal from "./modal/SettingsModal";
import BaseLayerOptions from "./BaseLayerOptions";

export let baseUrl: string;
export let cache: Cache;
export let customKey: string | null;
export let https: boolean;
export let map: Map;
export let sidebar: Sidebar;
export let modalSettings: SettingsModal;
export let projections: Record<string, {}>;
export let providers: Record<string, {}>;
export let files: {
  csv: Array<File>;
  geojson: Array<File>;
  gpx: Array<File>;
  kml: Array<File>;
} = {
  csv: [],
  geojson: [],
  gpx: [],
  kml: [],
};

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
  baselayers: Record<string, BaseLayerOptions>,
  layers: Array<{}>,
  files: Record<string, Array<{}>>,
  lnglat: Coordinate,
  zoom: number
) {
  cache = new Cache();

  map = initMap(lnglat, zoom, baselayers);
  initLayers(layers, files);
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
