"use strict";

import { Coordinate } from "ol/coordinate";
import { Modify, Snap } from "ol/interaction";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Feature, { FeatureLike } from "ol/Feature";
import MultiPoint from "ol/geom/MultiPoint";
import MultiLineString from "ol/geom/MultiLineString";
import MultiPolygon from "ol/geom/MultiPolygon";

import saveAs from "file-saver";

import DrawPoint from "./draw/DrawPoint";
import DrawLineString from "./draw/DrawLineString";
import DrawPolygon from "./draw/DrawPolygon";
import displayFeatureInList from "../info/feature";

import { customKey, map } from "../main";

class DrawModule {
  private active: boolean;
  private draw: DrawPoint | DrawLineString | DrawPolygon;
  private modify: Modify;
  private olLayer: VectorLayer;
  private snap: Snap;
  private storageKey: string;
  private type: string;

  public layerCurrent: VectorLayer;

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
        (document.getElementById(
          "btn-draw-clear"
        ) as HTMLButtonElement).disabled = false;
        (document.getElementById(
          "btn-draw-export"
        ) as HTMLButtonElement).disabled = false;
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

  enable(): void {
    document
      .querySelector(
        `#draw button.list-group-item-action[data-type="${this.type}"]`
      )
      .classList.add("active");

    map.addInteraction(this.modify);

    switch (this.type) {
      case "point":
        this.draw = new DrawPoint();
        break;
      case "linestring":
        this.draw = new DrawLineString();
        break;
      case "polygon":
        this.draw = new DrawPolygon();
        break;
    }
    map.addInteraction(this.draw);

    map.addLayer(this.layerCurrent);

    this.snap = new Snap({
      source: this.olLayer.getSource(),
    });
    map.addInteraction(this.snap);
  }

  disable(): void {
    (document.getElementById("btn-draw-properties") as HTMLFormElement).reset();

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

  clear(): void {
    (document.getElementById(
      "btn-draw-clear"
    ) as HTMLButtonElement).disabled = true;
    (document.getElementById(
      "btn-draw-export"
    ) as HTMLButtonElement).disabled = true;

    document.querySelectorAll(".draw-count").forEach((element: HTMLElement) => {
      element.innerText = "0";
    });

    this.olLayer.getSource().clear();

    this.clearLocalStorage();
  }

  showForm(): void {
    document.getElementById("btn-draw-properties").hidden = false;
  }

  resetForm(): void {
    document.getElementById("btn-draw-properties").hidden = true;

    this.layerCurrent.getSource().clear();
  }

  submitForm(): void {
    const label = (document.querySelector(
      'form#btn-draw-properties input[name="label"]'
    ) as HTMLInputElement).value;
    const description = (document.querySelector(
      'form#btn-draw-properties textarea[name="description"]'
    ) as HTMLTextAreaElement).value;

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

    (document.getElementById(
      "btn-draw-clear"
    ) as HTMLButtonElement).disabled = false;
    (document.getElementById(
      "btn-draw-export"
    ) as HTMLButtonElement).disabled = false;

    document.getElementById("btn-draw-properties").reset();

    document.getElementById(`draw-count-${this.type}`).innerText = `${
      count + 1
    }`;
  }

  saveLocalStorage(): void {
    localStorage.setItem(this.storageKey, this.toGeoJSON());
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.storageKey);
  }

  export(): void {
    const blob = new Blob([this.toGeoJSON()], {
      type: "application/json",
    });

    if (customKey !== null) {
      saveAs(blob, `mapper-${customKey}.json`);
    } else {
      saveAs(blob, "mapper.json");
    }
  }

  toGeoJSON(): string {
    const features = this.olLayer.getSource().getFeatures();
    const geojson = new GeoJSON().writeFeatures(features, {
      dataProjection: "EPSG:4326",
      decimals: 6,
      featureProjection: map.getView().getProjection(),
    });

    return geojson;
  }

  getFeatureInfo(coordinates: Coordinate): FeatureLike[] {
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
  displayFeaturesList(features: Feature[]): void {
    const title = "Draw";

    const ol = document.createElement("ol");

    const li = document.createElement("li");
    li.id = "info-layer-draw";
    li.innerHTML = `<strong>${title}</strong>`;
    li.append(ol);

    document.getElementById("info-list").append(li);

    features.forEach((feature: Feature) =>
      displayFeatureInList(feature, title, ol)
    );
  }
}

export { DrawModule as default };
