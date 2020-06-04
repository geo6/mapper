"use strict";

import WMSGetCapabilities from "./class/capabilities";
import WMSGetFeatureInfo from "./class/featureinfo";
import WMSDisplayFeatureList from "./class/featurelist";
import generateLayersList from "./class/list";
import WMSAddLayersToMap from "./class/map";
import WMSAddLayerToSidebar from "./class/sidebar";
import { createUlService } from "../../info/list/service";

import { map, sidebar } from "../../main";

/**
 *
 */
class WMS {
  /**
   *
   * @param {String} url        WMS service url.
   * @param {Function} callback Callback called after GetCapabilities().
   */
  constructor(url, callback) {
    this.url = url;
    this.capabilities = null;
    this.layers = null;
    this.olLayer = null;
    this.selection = [];
    this.mixedContent = false;

    this.getCapabilities(callback);
  }

  /**
   * @returns {Number} WMS service index in `window.app.wms` array.
   */
  getIndex() {
    return window.app.wms.indexOf(this);
  }

  /**
   *
   * @param {Function} callback Callback called after GetCapabilities().
   *
   * @returns {void}
   */
  getCapabilities(callback) {
    const getCapabilities = WMSGetCapabilities(this.url);
    if (getCapabilities instanceof Promise) {
      getCapabilities.then((response) => {
        this.capabilities = response.capabilities;
        this.layers = response.layers;
        this.mixedContent = response.mixedContent;

        callback.call(this, this);
      });
    }
  }

  /**
   * @returns {void}
   */
  displayCapabilities() {
    const index = this.getIndex();

    $(document.createElement("option"))
      .text(this.capabilities.Service.Title)
      .attr("value", `wms:${index}`)
      .data({
        index: index,
        target: `#modal-layers-wms-${index}`
      })
      .appendTo("#modal-layers-optgroup-wms");

    const div = document.createElement("div");

    $(document.createElement("span"))
      .text(this.capabilities.version)
      .addClass("badge badge-pill badge-info float-right")
      .appendTo(div);
    $(document.createElement("strong"))
      .html(
        this.capabilities.Service.Title.replace(
          /(\r\n|\n\r|\r|\n)/g,
          "<br>" + "$1"
        )
      )
      .appendTo(div);

    if (
      typeof this.capabilities.Service.Abstract !== "undefined" &&
      this.capabilities.Service.Abstract !== ""
    ) {
      $(document.createElement("p"))
        .addClass("text-info small")
        .html(
          this.capabilities.Service.Abstract.replace(
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
          "Please switch to HTTPS version of this service (if available - or enable <code>proxy</code> mode throught application settings) to be able to query features (see <a class=\"alert-link\" href=\"https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content\" target=\"_blank\">Mixed Active Content</a> for more details)."
        )
        .appendTo(div);
    }
    $(div)
      .append(generateLayersList(this, this.layers))
      .attr("id", `modal-layers-wms-${index}`)
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
    createUlService("wms", this.getIndex(), this.capabilities.Service.Title);

    const requests = WMSGetFeatureInfo(this, coordinate);
    Promise.all(requests).then((responses) => {
      $(`#info-service-wms-${this.getIndex()} > .loading`).remove();

      this.selection = responses;

      let total = 0;

      responses.forEach((response) => {
        if (response.features.length > 0) {
          WMSDisplayFeatureList(this, response.layer, response.features);
        }

        total += response.features.length;
      });

      if (total === 0) {
        $(`#info-service-wms-${this.getIndex()}`).remove();
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
      return layersName.indexOf(layer.Name) > -1;
    });

    WMSAddLayersToMap(this, layers);
  }

  /**
   *
   * @param {String[]} layersName Names of the layers to add to the sidebar.
   *
   * @returns {void}
   */
  addToSidebar(layersName) {
    layersName.forEach((layerName) => {
      const layer = this.layers.find((layer) => layer.Name === layerName);

      WMSAddLayerToSidebar(this, layer);
    });
  }

  /**
   *
   * @param {String} layerName Name of the layer to remove.
   *
   * @returns {void}
   */
  removeLayer(layerName) {
    const layers = this.olLayer.getSource().getParams().LAYERS;
    const index = layers.indexOf(layerName);

    if (index > -1) {
      layers.splice(index, 1);

      if (layers.length > 0) {
        this.olLayer.getSource().updateParams({
          LAYERS: layers
        });
      } else {
        map.removeLayer(this.olLayer);
        this.olLayer = null;
      }
    }
  }

  /**
   *
   * @param {String} layerName Name of the layer to zoom on.
   *
   * @returns {void}
   */
  zoom(layerName) {
    const projection = map.getView().getProjection().getCode();

    const layer = this.layers.find((layer) => layer.Name === layerName);
    const extent = layer.BoundingBox.find((bbox) => bbox.crs === projection);

    if (typeof extent !== "undefined") {
      map.getView().fit(extent.extent, {
        maxZoom: 18,
        padding: [15, 15, 15, 15]
      });

      sidebar.close();
    }
  }
}

export { WMS as default };
