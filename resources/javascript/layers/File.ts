"use strict";

import VectorLayer from "ol/layer/Vector";
import { ColorLike } from "ol/colorlike";
import { FeatureLike } from "ol/Feature";
import { ProjectionLike } from "ol/proj";
import slugify from "slugify";

import LegendOptions from "../_interface/LegendOptions";
import FileListCardComponent from "../components/files/FileListCard";
import sidebarElement from "./files/imports/sidebar";
import CSVAddFileToMap from "./files/csv";
import GeoJSONAddFileToMap from "./files/geojson";
import GPXAddFileToMap from "./files/gpx";
import KMLAddFileToMap from "./files/kml";
import layerStyleFunction from "../map/style";

import { baseUrl, customKey, files, map, projections, sidebar } from "../main";
import { layerGroupFiles } from "../map/layerGroup";

export const FILE_ZINDEX = 200;

/**
 *
 */
export class File {
  /** File description. */
  description?: string | null;
  color?: ColorLike | null = null;
  filter: Record<string, string> | null = null;
  /** File unique identifier. */
  identifier: string;
  /** Legend. */
  legend: LegendOptions | null;
  /** Is the file stored initially on the server. */
  local: boolean;
  /** Column used for labeling. */
  label?: string | null = null;
  /** File name. */
  name: string;
  olLayer: VectorLayer | null = null;
  queryable: boolean;
  selection: FeatureLike[] = [];
  sidebarElement: HTMLLIElement = null;
  /** File title. */
  title?: string | null;
  /** File type (csv|geojson|gpx|kml). */
  type: "csv" | "geojson" | "gpx" | "kml";
  url: string;
  /* File collection */
  collection: string[] | string | null;

  constructor(
    type: "csv" | "geojson" | "gpx" | "kml",
    identifier: string,
    name: string,
    options: {
      collection?: string[] | string | null;
      description?: string | null;
      label?: string | null;
      legend?: LegendOptions | null;
      queryable: boolean;
      title?: string | null;
    },
    filter: Record<string, string> | null,
    local: boolean
  ) {
    this.type = type;
    this.identifier = identifier;
    this.name = name;
    this.title = options.title;
    this.collection = options.collection;
    this.description = options.description;
    this.label = options.label;
    this.legend = options.legend;
    this.queryable = options.queryable;
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
        c: customKey,
      }).toString();

    this.sidebarElement = sidebarElement(this);
  }

  /**
   * @returns File index in `files[type]` array.
   */
  getIndex(): number {
    return files[this.type].indexOf(this);
  }

  /**
   * @param element DOM element to replace (used by upload).
   */
  displayInList(index: number, element?: HTMLElement): void {
    let listElement = document.querySelector(
      `#modal-layers-files-${this.type} > .list-group`
    );

    if (typeof this.collection !== "undefined" && this.collection !== null) {
      const slugCollection = Array.isArray(this.collection)
        ? slugify(this.collection.join("-"))
        : slugify(this.collection);

      const accordionElement = document.querySelector(
        `#modal-layers-files-${this.type} > .accordion`
      );

      if (
        accordionElement.querySelector(
          `div[data-collection=${slugCollection}]`
        ) === null
      ) {
        const FileListCard = FileListCardComponent(this.type, this.collection);

        accordionElement.append(FileListCard);
      }

      listElement = accordionElement.querySelector(
        `div[data-collection=${slugCollection}] > .collapse > .list-group`
      );
    }

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
        '<option value="EPSG:4326">WGS 84 (EPSG:4326)</option>';

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

    if (typeof this.title !== "undefined" && this.title !== null) {
      li.innerHTML += this.title;
    }
    if (typeof this.description !== "undefined" && this.description !== null) {
      const p = document.createElement("p");
      p.className = "text-info small mb-0";
      p.innerText = this.description;

      li.append(p);
    }
    if (typeof element !== "undefined") {
      element.parentElement.replaceChild(li, element);
    } else {
      listElement.append(li);
    }
  }

  addToSidebar(index?: number): void {
    sidebar.addLayer(this.type, this, index);
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
        style: (feature) =>
          layerStyleFunction(feature, this.label, this.color, this.filter),
        zIndex: FILE_ZINDEX,
      });

      layerGroupFiles.getLayers().push(this.olLayer);
    }
  }

  removeLayer(): void {
    layerGroupFiles.getLayers().remove(this.olLayer);

    this.olLayer = null;
    this.selection = [];
  }

  zoom(): void {
    const extent = this.olLayer.getSource().getExtent();

    map.getView().fit(extent, {
      maxZoom: 18,
      padding: [15, 15, 15, 15],
    });

    sidebar.close();
  }

  getColumns(): Array<string> {
    const features = this.olLayer.getSource().getFeatures();

    return features.length > 0 ? Object.keys(features[0].getProperties()) : [];
  }
}

export { File as default };
