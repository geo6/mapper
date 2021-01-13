"use strict";

import "../sass/main.scss";

import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tab";
import "bootstrap/js/dist/util";

import * as Sentry from "@sentry/browser";
import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import Cache from "./Cache";
import File from "./layers/File";
import WMS from "./layers/WMS";
import WMTS from "./layers/WMTS";
import initMap from "./map";
import initLayers from "./map/layers";
import initSearch from "./sidebar/search";
import initUpload from "./upload";
import Sidebar from "./Sidebar";
import SettingsModal from "./modal/SettingsModal";

import BaseLayerOptions from "./_interface/BaseLayerOptions";
import FileOptions from "./_interface/FileOptions";
import GeocoderProviderOptions from "./_interface/GeocoderProviderOptions";
import ProjectionOptions from "./_interface/ProjectionOptions";
import ServiceOptions from "./_interface/ServiceOptions";

export let baseUrl: string;
export let cache: Cache;
export let customKey: string;
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

export function initSentry(dsn: string): void {
  Sentry.init({ dsn });
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

  sidebar = new Sidebar("sidebar");
  modalSettings = new SettingsModal(document.getElementById("modal-settings"));

  map = initMap(lnglat, zoom, baselayers);
  map.addControl(sidebar.sidebar);

  initLayers(services, files);
  initSearch();
  initUpload();

  document.body.classList.add("loaded");
}
