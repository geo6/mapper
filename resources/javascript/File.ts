"use strict";

import VectorLayer from "ol/layer/Vector";
import { ColorLike } from "ol/colorlike";
import { Coordinate } from "ol/coordinate";
import { FeatureLike } from "ol/Feature";
import { ProjectionLike } from "ol/proj";

import displayFeatureInList from "./info/feature";
import CSVAddFileToMap from "./layers/files/csv";
import { add as GeoJSONAddFileToMap } from "./layers/files/geojson";
import GeoJSONLegend from "./layers/files/geojson/legend";
import GPXAddFileToMap from "./layers/files/gpx";
import KMLAddFileToMap from "./layers/files/kml";
import layerStyleFunction from "./map/style";
import ExtendedFeatureCollection from "./ExtendedFeatureCollection";

import { baseUrl, customKey, map, projections, sidebar } from "./main";

/**
 *
 */
export class File {
  /** File description. */
  description?: string | null;
  color?: ColorLike | null = null;
  content:
    | GeoJSON.FeatureCollection
    | GeoJSON.Feature
    | ExtendedFeatureCollection
    | null = null;

  filter: Record<string, string> | null = null;
  /** File unique identifier. */
  identifier: string;
  /** Is the file stored initially on the server. */
  local: boolean;
  /** Column used for labeling. */
  label?: string | null = null;
  /** File name. */
  name: string;
  olLayer: VectorLayer | null = null;
  selection: Array<any> = [];
  /** File title. */
  title?: string | null;
  /** File type (csv|geojson|gpx|kml). */
  type: string;
  url: string;

  constructor(
    type: string,
    identifier: string,
    name: string,
    title: string | null,
    description: string | null,
    filter: Record<string, string> | null,
    local: boolean
  ) {
    this.type = type;
    this.identifier = identifier;
    this.name = name;
    this.title = title;
    this.description = description;
    this.local = local || false;
    this.filter = filter;

    if (["csv", "geojson", "gpx", "kml"].indexOf(this.type) === -1) {
      throw new Error("Invalid file type.");
    }

    this.url =
      baseUrl +
      "file/" +
      (this.local ? "local/" : "") +
      this.identifier +
      "?" +
      new URLSearchParams({
        c: customKey !== null ? customKey : ""
      }).toString();
  }

  /**
   * @param element DOM element to replace (used by upload).
   */
  displayInList(index: number, element?: HTMLElement): void {
    const li = document.createElement("li");
    li.id = `file-${this.type}-${index}`;
    li.className = "list-group-item";
    li.dataset.index = index.toString();

    li.addEventListener("click", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      li.classList.toggle("list-group-item-primary");
    });

    if (this.type === "csv") {
      const select = document.createElement("select");
      select.className =
        "float-right form-control form-control-sm d-inline-block w-auto";
      select.innerHTML =
        "<option value=\"EPSG:4326\">WGS 84 (EPSG:4326)</option>";

      select.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      li.append(select);

      projections.forEach((proj) => {
        select.innerHTML += `<option value="${proj.name}">${proj.description} (${proj.name})</option>`;
      });

      li.innerHTML += `<strong style="line-height: calc(1.8125rem + 2px);">${this.name}</strong><br>`;
    } else {
      li.innerHTML = `<strong>${this.name}</strong><br>`;
    }

    if (this.title !== null) {
      li.innerHTML += this.title;
    }
    if (this.description !== null) {
      const p = document.createElement("p");
      p.className = "text-info small";
      p.innerText = this.description;

      li.append(p);
    }

    if (typeof element !== "undefined") {
      element.parentElement.replaceChild(li, element);
    } else {
      document
        .querySelector(`#modal-layers-files-${this.type} > .list-group`)
        .append(li);
    }
  }

  displayInSidebar(index: number): void {
    let legend = null;
    if (
      this.type === "geojson" &&
      typeof this.content.legend === "object" &&
      Array.isArray(this.content.legend)
    ) {
      legend = GeoJSONLegend(this.content.legend);
    }

    sidebar.addLayerInList(
      this.type,
      index,
      this.name,
      this.name,
      true,
      true,
      legend
    );
  }

  addToMap(projection: ProjectionLike): void {
    let source = null;
    switch (this.type) {
      case "csv":
        CSVAddFileToMap(this, projection); // async
        break;
      case "geojson":
        source = GeoJSONAddFileToMap(this);
        break;
      case "gpx":
        source = GPXAddFileToMap(this);
        break;
      case "kml":
        source = KMLAddFileToMap(this);
        break;
    }

    if (source !== null) {
      this.olLayer = new VectorLayer({
        source: source,
        style: (feature, resolution) =>
          layerStyleFunction(feature, this.label, this.color, resolution)
      });

      map.addLayer(this.olLayer);
    }
  }

  removeFromMap(): void {
    map.removeLayer(this.olLayer);

    this.olLayer = null;
    this.selection = [];
  }

  zoom(): void {
    const extent = this.olLayer.getSource().getExtent();

    map.getView().fit(extent, {
      maxZoom: 18,
      padding: [15, 15, 15, 15]
    });

    sidebar.close();
  }

  getColumns(): Array<string> {
    const features = this.olLayer.getSource().getFeatures();

    return features.length > 0 ? Object.keys(features[0].getProperties()) : [];
  }

  getFeatureInfo(coordinates: Coordinate): Array<FeatureLike> {
    const pixel = map.getPixelFromCoordinate(coordinates);

    if (this.olLayer === null) {
      return [];
    }

    return map.getFeaturesAtPixel(pixel, {
      // hitTolerance: 10,
      layerFilter: (layer) => {
        return layer === this.olLayer;
      }
    });
  }

  /**
   * Generate list with the result of GetFeatureInfo request on a file in the sidebar.
   *
   * @param features Feature to display.
   */
  displayFeaturesList(index: number, features: Array<FeatureLike>): void {
    const title = this.title || this.name;

    const ol = document.createElement("ol");

    const li = document.createElement("li");
    li.id = `info-layer-${this.type}-${index}`;
    li.innerHTML = `<strong>${title}</strong>`;

    li.append(ol);

    document.getElementById("info-list").append(li);

    features.forEach((feature) => displayFeatureInList(feature, title, ol));
  }
}

export { File as default };
