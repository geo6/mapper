"use strict";

import "../sass/style.scss";

import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import Cache from "./Cache";
import File from "./File";
import initMap from "./map";
import initLayers from "./map/layers";
import initUpload from "./upload";
import Sidebar from "./Sidebar";
import SettingsModal from "./modal/SettingsModal";
import WMS from "./layers/wms/WMS";
import WMTS from "./layers/wmts/wmts";

import BaseLayerOptions from "./BaseLayerOptions";
import FileOptions from "./FileOptions";
import GeocoderProviderOptions from "./GeocoderProviderOptions";
import ProjectionOptions from "./ProjectionOptions";
import ServiceOptions from "./ServiceOptions";

export let baseUrl: string;
export let cache: Cache;
export let customKey: string | null;
export let https: boolean;
export let map: Map;
export let sidebar: Sidebar;
export let modalSettings: SettingsModal;
export let projections: ProjectionOptions[];
export let providers: Record<string, GeocoderProviderOptions>;
export const services: {
  wms: Array<WMS>;
  wmts: Array<WMTS>;
} = {
  wms: [],
  wmts: [],
};
export const files: {
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

export function setProviders(
  _providers: Record<string, GeocoderProviderOptions>
): void {
  providers = _providers;
}

export function setProjections(_projections: ProjectionOptions[]): void {
  projections = _projections;

  projections.forEach((proj) => {
    proj4.defs(proj.name, proj.proj4);
  });

  register(proj4);
}

export function setMap(
  baselayers: Record<string, BaseLayerOptions>,
  services: Record<string, ServiceOptions[]>,
  files: Record<string, FileOptions[]>,
  lnglat: Coordinate,
  zoom: number
): void {
  cache = new Cache();

  map = initMap(lnglat, zoom, baselayers);
  initLayers(services, files);
  initUpload();

  sidebar = new Sidebar(document.getElementById("sidebar"));
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  document.body.classList.add("loaded");
}
