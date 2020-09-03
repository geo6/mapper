"use strict";

import Map from "ol/Map";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import TileLayer from "ol/layer/Tile";
import { TileWMS, WMTS, XYZ } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";

import Cache from "./Cache";
import BaseLayerOptions from "./_interface/BaseLayerOptions";

export class BaseLayer {
  private element: HTMLButtonElement;
  private cache: Cache;
  private map: Map;
  private options: BaseLayerOptions;

  constructor(map: Map, cache: Cache, key: string, options: BaseLayerOptions) {
    this.element = document
      .getElementById("baselayers")
      .querySelector(`button[data-index="${key}"]`);

    this.map = map;
    this.cache = cache;
    this.options = options;

    this.element.addEventListener("click", () => {
      this.cache.setBaselayer(key);

      this.highlight().addToMap();
    });
  }

  highlight(): this {
    this.element.parentElement
      .querySelectorAll("button.active")
      .forEach((element: HTMLButtonElement) => {
        element.classList.remove("active");
      });
    this.element.classList.add("active");

    return this;
  }

  addToMap(): this {
    switch (this.options.mode) {
      case "wms":
        this.addWMSToMap();
        break;
      case "wmts":
        this.addWMTSToMap();
        break;
      default:
        this.addXYZToMap();
        break;
    }

    return this;
  }

  private addWMSToMap(): void {
    this.map.getLayers().setAt(
      0,
      new TileLayer({
        maxZoom: this.options.maxZoom,
        source: new TileWMS({
          attributions: this.options.attributions,
          params: {
            LAYERS: this.options.layers,
            TRANSPARENT: false,
          },
          url: this.options.url,
        }),
      })
    );
  }

  private addWMTSToMap() {
    fetch(
      this.options.url +
        "?" +
        new URLSearchParams({
          SERVICE: "WMTS",
          REQUEST: "GetCapabilities",
          VERSION: "1.0.0",
        }).toString()
    )
      .then((response: Response) => response.text())
      .then((text: string) => {
        const capabilities = new WMTSCapabilities().read(text);

        const options = optionsFromCapabilities(capabilities, {
          layer: this.options.layer,
        });
        if (
          typeof this.options.attributions !== "undefined" &&
          this.options.attributions !== null
        ) {
          options.attributions = this.options.attributions;
        }

        this.map.getLayers().setAt(
          0,
          new TileLayer({
            maxZoom: this.options.maxZoom,
            source: new WMTS(options),
          })
        );
      });
  }

  private addXYZToMap() {
    this.map.getLayers().setAt(
      0,
      new TileLayer({
        maxZoom: this.options.maxZoom,
        source: new XYZ({
          attributions: this.options.attributions,
          url: this.options.url,
        }),
      })
    );
  }
}

export { BaseLayer as default };
