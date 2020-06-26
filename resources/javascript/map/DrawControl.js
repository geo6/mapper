"use strict";

import $ from "jquery";

import { Modify, Snap } from "ol/interaction";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Feature from "ol/Feature";
import MultiPoint from "ol/geom/MultiPoint";
import MultiLineString from "ol/geom/MultiLineString";
import MultiPolygon from "ol/geom/MultiPolygon";

import saveAs from "file-saver";

import DrawPoint from "./draw/DrawPoint";
import DrawLineString from "./draw/DrawLineString";
import DrawPolygon from "./draw/DrawPolygon";
import displayFeatureInList from "../info/feature";

import { customKey, map } from "../main";

class DrawControl {
  constructor() {
    this.active = false;
    this.type = null;

    if (customKey !== null) {
      this.storageKey = `mapper.${customKey}.draw`;
    } else {
      this.storageKey = "mapper.draw";
    }

    const storage = localStorage.getItem(this.storageKey);
    let features = [];
    if (storage !== null) {
      features = new GeoJSON().readFeatures(storage, {
        featureProjection: map.getView().getProjection(),
      });
      features.forEach((feature) => {
        const type = feature.getId().substring(0, feature.getId().indexOf("-"));
        const count = parseInt(
          document.getElementById(`draw-count-${type.toLowerCase()}`).innerText
        );
        document.getElementById(
          `draw-count-${type.toLowerCase()}`
        ).innerText = `${count + 1}`;
      });

      if (features.length > 0) {
        document.getElementById("btn-draw-clear").disabled = false;
        document.getElementById("btn-draw-export").disabled = false;
      }
    }

    this.olLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
      // style: new Style({
      //     fill: new Fill({
      //         color: 'rgba(255, 255, 255, 0.2)'
      //     }),
      //     stroke: new Stroke({
      //         color: '#ffcc33',
      //         width: 2
      //     }),
      //     image: new CircleStyle({
      //         radius: 7,
      //         fill: new Fill({
      //             color: '#ffcc33'
      //         })
      //     })
      // }),
      zIndex: Infinity,
    });
    map.addLayer(this.olLayer);

    this.layerCurrent = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
      zIndex: Infinity,
    });

    this.modify = new Modify({
      source: this.layerCurrent.getSource(),
    });
  }

  enable() {
    document
      .querySelector(
        `#draw button.list-group-item-action[data-type="${this.type}"]`
      )
      .classList.add("active");

    map.addInteraction(this.modify);

    switch (this.type) {
      case "point":
        this.draw = new DrawPoint(this);
        break;
      case "linestring":
        this.draw = new DrawLineString(this);
        break;
      case "polygon":
        this.draw = new DrawPolygon(this);
        break;
    }
    map.addInteraction(this.draw);

    map.addLayer(this.layerCurrent);

    this.snap = new Snap({
      source: this.olLayer.getSource(),
    });
    map.addInteraction(this.snap);
  }

  disable() {
    document.getElementById("btn-draw-properties").reset();

    if (this.type !== null) {
      document
        .querySelector(
          `#draw button.list-group-item-action[data-type="${this.type}"]`
        )
        .classList.remove("active");
    }

    map.removeLayer(this.layerCurrent);

    if (this.snap !== null) {
      map.removeInteraction(this.snap);
      this.snap = null;
    }
    if (this.draw !== null) {
      map.removeInteraction(this.draw);
      this.draw = null;
    }

    map.removeInteraction(this.modify);
  }

  clear() {
    document.getElementById("btn-draw-clear").disabled = true;
    document.getElementById("btn-draw-export").disabled = true;

    document.querySelectorAll(".draw-count").forEach((element) => {
      element.innerText = "0";
    });

    this.olLayer.getSource().clear();

    this.clearLocalStorage();
  }

  showForm() {
    document.getElementById("btn-draw-properties").hidden = false;
  }

  resetForm() {
    document.getElementById("btn-draw-properties").hidden = true;

    this.layerCurrent.getSource().clear();
  }

  submitForm() {
    const label = document.querySelector(
      'form#btn-draw-properties input[name="label"]'
    ).value;
    const description = document.querySelector(
      'form#btn-draw-properties textarea[name="description"]'
    ).value;

    const features = this.layerCurrent.getSource().getFeatures();
    const feature = new Feature();

    const count = parseInt(
      document.getElementById(`draw-count-${this.type}`).innerText
    );

    feature.setId(`${this.type}-${count + 1}`);
    feature.setProperties({ label, description });

    if (features.length === 1) {
      feature.setGeometry(features[0].getGeometry());
    } else {
      const coordinates = features.map((feature) =>
        feature.getGeometry().getCoordinates()
      );

      switch (this.type) {
        case "point":
          feature.setGeometry(new MultiPoint(coordinates));
          break;
        case "linestring":
          feature.setGeometry(new MultiLineString(coordinates));
          break;
        case "polygon":
          feature.setGeometry(new MultiPolygon(coordinates));
          break;
      }
    }

    this.olLayer.getSource().addFeature(feature);
    this.snap.addFeature(feature);

    this.saveLocalStorage();

    document.getElementById("btn-draw-clear").disabled = false;
    document.getElementById("btn-draw-export").disabled = false;

    document.getElementById("btn-draw-properties").reset();

    document.getElementById(`draw-count-${this.type}`).innerText = `${
      count + 1
    }`;
  }

  saveLocalStorage() {
    localStorage.setItem(this.storageKey, this.toGeoJSON());
  }

  clearLocalStorage() {
    localStorage.removeItem(this.storageKey);
  }

  export() {
    const blob = new Blob([this.toGeoJSON()], {
      type: "application/json",
    });

    if (customKey !== null) {
      saveAs(blob, `mapper-${customKey}.json`);
    } else {
      saveAs(blob, "mapper.json");
    }
  }

  toGeoJSON() {
    const features = this.olLayer.getSource().getFeatures();
    const geojson = new GeoJSON().writeFeatures(features, {
      dataProjection: "EPSG:4326",
      decimals: 6,
      featureProjection: map.getView().getProjection(),
    });

    return geojson;
  }

  getFeatureInfo(coordinates) {
    const pixel = map.getPixelFromCoordinate(coordinates);

    if (this.olLayer === null) {
      return [];
    }

    return map.getFeaturesAtPixel(pixel, {
      hitTolerance: 10,
      layerFilter: (layer) => {
        return layer === this.olLayer;
      },
    });
  }

  /**
   * Generate list with the result of GetFeatureInfo request on a file in the sidebar.
   *
   * @param {Feature[]} features Feature to display.
   *
   * @returns {void}
   */
  displayFeaturesList(features) {
    const title = "Draw";

    const ol = document.createElement("ol");

    $(document.createElement("li"))
      .attr("id", "info-layer-draw")
      .append(`<strong>${title}</strong>`)
      .append(ol)
      .appendTo("#info-list");

    features.forEach((feature) => displayFeatureInList(feature, title, ol));
  }
}

export { DrawControl as default };
