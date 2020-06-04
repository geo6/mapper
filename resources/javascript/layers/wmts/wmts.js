"use strict";

import WMTSGetCapabilities from "./class/capabilities";
import WMTSGetFeatureInfo from "./class/featureinfo";
import WMTSDisplayFeatureList from "./class/featurelist";
import generateLayersList from "./class/list";
import WMTSAddLayersToMap from "./class/map";
import WMTSAddLayerToSidebar from "./class/sidebar";
import { createUlService } from "../../info/list/service";

import { map } from "../../main";

/**
 *
 */
class WMTS {
  /**
   *
   * @param {String} url        WMTS service url.
   * @param {Function} callback Callback called after GetCapabilities().
   */
  constructor(url, callback) {
    this.url = url;
    this.capabilities = null;
    this.layers = null;
    this.olLayers = {};
    this.selection = [];
    this.projection = null;

    this.getCapabilities(callback);
  }

  /**
   * @returns {Number} WMTS service index in `window.app.wmts` array.
   */
  getIndex() {
    return window.app.wmts.indexOf(this);
  }

  /**
   *
   * @param {Function} callback Callback called after GetCapabilities().
   *
   * @returns {void}
   */
  getCapabilities(callback) {
    const getCapabilities = WMTSGetCapabilities(this.url);
    if (getCapabilities instanceof Promise) {
      getCapabilities.then((response) => {
        this.capabilities = response.capabilities;
        this.layers = response.layers;
        this.mixedContent = response.mixedContent;
        this.projection = response.projection;

        callback.call(this, this);
      });
    }
  }

  /**
   * @returns {void}
   */
  displayCapabilities() {
    const index = this.getIndex();
    const title =
      this.capabilities.ServiceIdentification.Title || this.layers[0].Title;

    $(document.createElement("option"))
      .text(title)
      .attr("value", `wmts:${index}`)
      .data({
        index: index,
        target: `#modal-layers-wmts-${index}`,
      })
      .appendTo("#modal-layers-optgroup-wmts");

    const div = document.createElement("div");

    $(document.createElement("span"))
      .text(this.capabilities.version)
      .addClass("badge badge-pill badge-info float-right")
      .appendTo(div);
    $(document.createElement("strong"))
      .html(title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1"))
      .appendTo(div);

    if (
      typeof this.capabilities.ServiceIdentification.Abstract !== "undefined" &&
      this.capabilities.ServiceIdentification.Abstract !== ""
    ) {
      $(document.createElement("p"))
        .addClass("text-info small")
        .html(
          this.capabilities.ServiceIdentification.Abstract.replace(
            /(\r\n|\n\r|\r|\n)/g,
            "<br>" + "$1"
          )
        )
        .appendTo(div);
    }

    if (this.mixedContent === true) {
      $(document.createElement("p"))
        .addClass("alert alert-warning small mt-3")
        .html(
          'Please switch to HTTPS version of this service (if available - or enable <code>proxy</code> mode throught application settings) to be able to query features (see <a class="alert-link" href="https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content" target="_blank">Mixed Active Content</a> for more details).'
        )
        .appendTo(div);
    }
    $(div)
      .append(generateLayersList(this, this.layers))
      .attr("id", `modal-layers-wmts-${index}`)
      .hide();

    $("#modal-layers-layers").append(div);
  }

  /**
   *
   * @param {Number[]} coordinate Coordinate.
   *
   * @returns {void}
   */
  getFeatureInfo(coordinate) {
    const title =
      this.capabilities.ServiceIdentification.Title || this.layers[0].Title;
    createUlService("wmts", this.getIndex(), title);

    const requests = WMTSGetFeatureInfo(this, coordinate);
    Promise.all(requests).then((responses) => {
      $(`#info-service-wmts-${this.getIndex()} > .loading`).remove();

      this.selection = responses;

      const total = 0;

      responses.forEach((response) => {
        if (response.features.length > 0) {
          WMTSDisplayFeatureList(this, response.layer, response.features);
        }
      });

      if (total === 0) {
        $(`#info-service-wmts-${this.getIndex()}`).remove();
      }
    });
  }

  /**
   *
   * @param {String[]} layersName Names of the layers to add to the map.
   *
   * @returns {void}
   */
  addToMap(layersName) {
    const layers = this.layers.filter((layer) => {
      return layersName.indexOf(layer.Identifier) > -1;
    });

    WMTSAddLayersToMap(this, layers);
  }

  /**
   *
   * @param {String[]} layersName Names of the layers to add to the sidebar.
   *
   * @returns {void}
   */
  addToSidebar(layersName) {
    layersName.forEach((layerName) => {
      const layer = this.layers.find((layer) => layer.Identifier === layerName);

      WMTSAddLayerToSidebar(this, layer);
    });
  }

  /**
   *
   * @param {String} layerName Name of the layer to remove.
   *
   * @returns {void}
   */
  removeLayer(layerName) {
    if (this.olLayers[layerName] !== "undefined") {
      map.removeLayer(this.olLayers[layerName]);
      delete this.olLayers[layerName];
    }
  }
}

export { WMTS as default };
