"use strict";

import { Coordinate } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import { ProjectionLike } from "ol/proj";
import { TileWMS } from "ol/source";

import WMSGetCapabilities from "./imports/capabilities";
import WMSGetFeatureInfo from "./imports/featureinfo";
import WMSDisplayFeatureList from "./imports/featurelist";
import generateLayersList from "./imports/list";
import WMSAddLayersToMap from "./imports/map";
import WMSAddLayerToSidebar from "./imports/sidebar";
import { createUlService } from "../../info/list/service";

import { map, services, sidebar } from "../../main";
import { Feature } from "ol";

/**
 *
 */
class WMS {
  capabilities: unknown;
  layers: unknown[];
  mixedContent: boolean;
  olLayer: TileLayer;
  projection: ProjectionLike;
  selection: unknown[];
  url: string;

  /**
   * @param string     url      WMS service url.
   * @param {Function} callback Callback called after GetCapabilities().
   */
  constructor(url: string, callback: (service: WMS) => void) {
    this.url = url;
    this.capabilities = null;
    this.layers = null;
    this.olLayer = null;
    // this.selection = [];
    this.mixedContent = false;

    this.getCapabilities(callback);
  }

  /**
   * @returns WMS service index in `services.wms` array.
   */
  getIndex(): number {
    return services.wms.indexOf(this);
  }

  /**
   * @param callback Callback called after GetCapabilities().
   */
  async getCapabilities(callback: (service: WMS) => void): Promise<void> {
    const response = await WMSGetCapabilities(this.url);

    this.capabilities = response.capabilities;
    this.layers = response.layers;
    this.mixedContent = response.mixedContent;
    this.projection = response.projection;

    callback.call(this, this);
  }

  displayCapabilities(): void {
    const index = this.getIndex();

    const option = document.createElement("option");
    option.innerText = this.capabilities.Service.Title;
    option.value = `wms:${index}`;
    option.dataset.index = index.toString();
    option.dataset.target = `#modal-layers-wms-${index}`;

    document.getElementById("modal-layers-optgroup-wms").append(option);

    const { version } = this.capabilities;
    const { Title, Abstract } = this.capabilities.Service;

    const div = document.createElement("div");
    div.id = `modal-layers-wms-${index}`;
    div.style.display = "none";

    const spanVersion = document.createElement("span");
    spanVersion.innerText = version;
    spanVersion.className = "badge badge-info float-right";
    div.append(spanVersion);

    const spanTitle = document.createElement("span");
    spanTitle.innerHTML = Title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1");
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
  async getFeatureInfo(coordinate: Coordinate): void {
    const source = this.olLayer.getSource() as TileWMS;

    createUlService("wms", this.getIndex(), this.capabilities.Service.Title);

    const requests: Array<Promise<{
      layer: string;
      features: Feature[];
    }>> = [];
    const activeLayers = source.getParams().LAYERS || [];
    activeLayers.forEach((name: string) => {
      requests.push(WMSGetFeatureInfo(this, name, coordinate));
    });

    const results = await Promise.all(requests);
    // this.selection = results;

    document
      .querySelector(`#info-service-wms-${this.getIndex()} > .loading`)
      .remove();

    let total = 0;
    results.forEach((result) => {
      if (result.features.length > 0) {
        WMSDisplayFeatureList(this, result.layer, result.features);
      }

      total += result.features.length;
    });

    if (total === 0) {
      document.getElementById(`info-service-wms-${this.getIndex()}`).remove();
    }
  }

  /**
   * @param names Names of the layers to add to the map.
   */
  addToMap(names: string[]): void {
    WMSAddLayersToMap(this, names);
  }

  /**
   * @param names Names of the layers to add to the sidebar.
   */
  addToSidebar(names: string[]): void {
    names.forEach((name: string) => {
      const layer = this.layers.find((layer) => layer.Name === name);

      WMSAddLayerToSidebar(this, layer);
    });
  }

  /**
   * @param name Name of the layer to remove.
   */
  removeLayer(name: string): void {
    const source = this.olLayer.getSource() as TileWMS;
    const layers = source.getParams().LAYERS;
    const index = layers.indexOf(name);

    if (index > -1) {
      layers.splice(index, 1);

      if (layers.length > 0) {
        source.updateParams({
          LAYERS: layers,
        });
      } else {
        map.removeLayer(this.olLayer);
        this.olLayer = null;
      }
    }
  }

  /**
   * @param name Name of the layer to zoom on.
   */
  zoom(name: string): void {
    const projection = map.getView().getProjection().getCode();

    const layer = this.layers.find((layer) => layer.Name === name);
    const extent = layer.BoundingBox.find((bbox) => bbox.crs === projection);

    if (typeof extent !== "undefined") {
      map.getView().fit(extent.extent, {
        maxZoom: 18,
        padding: [15, 15, 15, 15],
      });

      sidebar.close();
    }
  }
}

export { WMS as default };
