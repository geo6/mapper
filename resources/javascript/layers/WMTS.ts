"use strict";

import { Coordinate } from "ol/coordinate";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import { ProjectionLike } from "ol/proj";
import WMTSSource from "ol/source/WMTS";

import WMTSGetCapabilities from "./wmts/imports/capabilities";
import WMTSGetFeatureInfo from "./wmts/imports/featureinfo";
import WMTSDisplayFeatureList from "./wmts/imports/featurelist";
import generateLayersList from "./wmts/imports/list";
import WMTSAddLayersToMap from "./wmts/imports/map";
import { create as sidebarElement } from "./wmts/imports/sidebar";
import { createUlService } from "../info/list/service";

import { services, sidebar } from "../main";
import { layerGroup } from "../map/layerGroup";

/**
 *
 */
class WMTS {
  capabilities: unknown;
  layers: unknown[];
  mixedContent: boolean;
  olLayers: LayerGroup;
  projection: ProjectionLike;
  selection: unknown[];
  sidebarElement: HTMLLIElement = null;
  url: string;

  /**
   * @param url      WMTS service url.
   * @param callback Callback called after GetCapabilities().
   */
  constructor(url: string, callback: (service: WMTS) => void) {
    this.url = url;
    this.capabilities = null;
    this.layers = null;
    this.olLayers = new LayerGroup();
    this.selection = [];
    this.projection = null;

    this.getCapabilities(callback);
  }

  /**
   * @returns WMTS service index in ` services.wmts` array.
   */
  getIndex(): number {
    return services.wmts.indexOf(this);
  }

  /**
   * @param callback Callback called after GetCapabilities().
   */
  async getCapabilities(callback: (service: WMTS) => void): Promise<void> {
    const response = await WMTSGetCapabilities(this.url);

    if (response !== null) {
      this.capabilities = response.capabilities;
      this.layers = response.layers;
      this.mixedContent = response.mixedContent;
      this.projection = response.projection;

      this.sidebarElement = sidebarElement(this);

      callback.call(this, this);
    }
  }

  displayCapabilities(): void {
    const index = this.getIndex();

    const { version } = this.capabilities;
    const { Title, Abstract } = this.capabilities.ServiceIdentification;
    const title = Title || this.layers[0].Title;

    const option = document.createElement("option");
    option.innerText = title;
    option.value = `wmts:${index}`;
    option.dataset.index = index.toString();
    option.dataset.target = `#modal-layers-wmts-${index}`;

    document.getElementById("modal-layers-optgroup-wmts").append(option);

    const div = document.createElement("div");
    div.id = `modal-layers-wmts-${index}`;
    div.style.display = "none";

    const spanVersion = document.createElement("span");
    spanVersion.innerText = version;
    spanVersion.className = "badge badge-info float-right";
    div.append(spanVersion);

    const spanTitle = document.createElement("span");
    spanTitle.innerHTML = title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1");
    spanTitle.className = "font-weight-bold";
    div.append(spanTitle);

    if (typeof Abstract !== "undefined" && Abstract !== "") {
      const pAbstract = document.createElement("p");
      pAbstract.className = "text-info small";
      pAbstract.innerHTML = Abstract.replace(
        /(\r\n|\n\r|\r|\n)/g,
        "<br>" + "$1"
      );
      div.append(pAbstract);
    }

    if (this.mixedContent === true) {
      const alertMixedContent = document.createElement("p");
      alertMixedContent.className = "alert alert-warning small mt-3";
      alertMixedContent.innerHTML =
        "Please switch to HTTPS version of this service (if available - or enable <code>proxy</code> mode throught application settings) to be able to query features" +
        ' (see <a class="alert-link" href="https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content" target="_blank">Mixed Active Content</a> for more details).';
      div.append(alertMixedContent);
    }

    div.append(generateLayersList(this));

    document.getElementById("modal-layers-layers").append(div);
  }

  /**
   * @param coordinate Coordinate.
   */
  async getFeatureInfo(coordinate: Coordinate): Promise<void> {
    const title =
      this.capabilities.ServiceIdentification.Title || this.layers[0].Title;

    createUlService("wmts", this.getIndex(), title);

    const requests = WMTSGetFeatureInfo(this, coordinate);
    Promise.all(requests).then((responses) => {
      document
        .querySelector(`#info-service-wmts-${this.getIndex()} > .loading`)
        .remove();

      this.selection = responses;

      const total = 0;

      responses.forEach((response) => {
        if (response.features.length > 0) {
          WMTSDisplayFeatureList(this, response.layer, response.features);
        }
      });

      if (total === 0) {
        document
          .getElementById(`info-service-wmts-${this.getIndex()}`)
          .remove();
      }
    });
  }

  /**
   * @param names Names of the layers to add to the map.
   */
  addToMap(names: string[]): void {
    WMTSAddLayersToMap(this, names);
  }

  addToSidebar(index?: number): void {
    sidebar.addLayer(this, index);
  }

  /**
   * @param name Name of the layer to remove.
   */
  removeLayer(name: string): void {
    const layer = this.olLayers
      .getLayersArray()
      .find(
        (layer: TileLayer) =>
          (layer.getSource() as WMTSSource).getLayer() === name
      );

    if (typeof layer !== "undefined") {
      this.olLayers.getLayers().remove(layer);
    }

    if (this.olLayers.getLayers().getLength() === 0) {
      layerGroup.getLayers().remove(this.olLayers);
    }
  }
}

export { WMTS as default };
