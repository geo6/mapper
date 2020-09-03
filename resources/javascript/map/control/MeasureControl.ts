"use strict";

import Control, { Options } from "ol/control/Control";
import DrawInteraction from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";

import { createButton as createButtonArea } from "./MeasureControl/area";
import createElementMeasure from "./MeasureControl/dom";
import createInteraction from "./MeasureControl/draw";
import createLayer from "./MeasureControl/layer";
import { createButton as createButtonLength } from "./MeasureControl/length";

class MeasureControl extends Control {
  private active: boolean;
  private elementResult: HTMLDivElement;
  private interaction: DrawInteraction;
  private layer: VectorLayer;
  private type: "length" | "area" | null;

  constructor(options?: Options) {
    const buttonLength = createButtonLength();
    const buttonArea = createButtonArea();

    const buttonGroup = document.createElement("div");

    buttonGroup.className = "ol-measure ol-unselectable ol-control";
    buttonGroup.appendChild(buttonLength);
    buttonGroup.appendChild(buttonArea);

    super({
      element: buttonGroup,
      target: options.target,
    });

    buttonLength.addEventListener(
      "click",
      this.handleMeasure.bind(this, "length"),
      false
    );
    buttonArea.addEventListener(
      "click",
      this.handleMeasure.bind(this, "area"),
      false
    );

    this.elementResult = createElementMeasure("map");

    this.layer = createLayer();
    this.active = false;
    this.interaction = null;
    this.type = null;
  }

  /**
   * Add or remove Interaction and Layer to the map.
   *
   * @param {string} type Measure tool type (length|area).
   *
   * @returns {void}
   */
  handleMeasure(type: "length" | "area"): void {
    this.active = !this.active;

    this.layer.getSource().clear();

    if (this.active === true) {
      this.type = type;

      this.interaction = createInteraction(
        this.getMap(),
        this.elementResult,
        this.layer.getSource(),
        type,
        2
      );

      this.getMap().addInteraction(this.interaction);
      this.getMap().addLayer(this.layer);

      this.elementResult.style.display = "block";
    } else {
      this.type = null;

      this.getMap().removeInteraction(this.interaction);
      this.getMap().removeLayer(this.layer);

      this.elementResult.style.display = "none";
      this.elementResult.innerHTML = "";
    }
  }
}

export { MeasureControl as default };
