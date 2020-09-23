"use strict";

import $ from "jquery";

import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/button";

import File from "../layers/File";
import { ColorLike } from "ol/colorlike";

export class SettingsModal {
  private element: HTMLElement;
  private form: HTMLFormElement;

  private labelOptGroup: HTMLOptGroupElement;
  private colorInput: HTMLInputElement;
  private colorInputText: HTMLElement;
  private legendInput: HTMLInputElement;
  private opacityInput: HTMLInputElement;
  private opacityInputText: HTMLElement;

  private layer: File = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.form = this.element.querySelector("form");

    this.labelOptGroup = document.querySelector(
      "#layer-label > optgroup"
    ) as HTMLOptGroupElement;
    this.colorInput = document.getElementById(
      "layer-color"
    ) as HTMLInputElement;
    this.colorInputText = document.getElementById(
      "layer-color-text"
    ) as HTMLElement;
    this.legendInput = document.getElementById(
      "layer-legend"
    ) as HTMLInputElement;
    this.opacityInput = document.getElementById(
      "layer-opacity"
    ) as HTMLInputElement;
    this.opacityInputText = document.getElementById(
      "layer-opacity-text"
    ) as HTMLElement;

    this.opacityInput.addEventListener("change", () => {
      this.opacityInputText.innerText = `${this.opacityInput.value}%`;
    });

    this.legendInput.addEventListener("change", () => {
      this.colorInput.disabled = this.legendInput.checked;
    });

    this.form.addEventListener("reset", () => {
      this.colorInput.disabled = false;
      this.legendInput.parentElement.hidden = true;
      this.colorInputText.innerText = "";
      this.colorInputText.hidden = true;
      this.opacityInputText.innerText = "";
    });

    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      this.layer.color = this.getColor();
      this.layer.label = this.getLabel();
      this.layer.queryable = this.getQueryable();

      if (this.layer.queryable === true) {
        const element = this.layer.sidebarElement.querySelector(
          ".layer-name"
        ) as HTMLDivElement;
        element.innerHTML =
          '<i class="fas fa-fw fa-info-circle"></i> ' + element.innerText;
      } else if (
        this.layer.sidebarElement.querySelector(
          ".layer-name > .fa-info-circle"
        ) !== null
      ) {
        this.layer.sidebarElement
          .querySelector(".layer-name > .fa-info-circle")
          .remove();
      }

      this.layer.olLayer.setOpacity(this.getOpacity());

      this.layer.olLayer.changed();

      this.layer = null;

      this.hide();
    });
  }

  show(): void {
    $(this.element).modal("show");
  }

  hide(): void {
    $(this.element).modal("hide");
  }

  reset(): void {
    this.form.reset();
  }

  setLayer(layer: File, name: string): void {
    this.layer = layer;

    (this.element.querySelector(
      ".modal-body > span.font-weight-bold"
    ) as HTMLSpanElement).innerText = name;

    const url = new URL(this.layer.url, new URL(window.location.href).origin);
    url.pathname += "/download";
    (this.element.querySelector(
      "#btn-settings-download"
    ) as HTMLLinkElement).href = url.href;

    this.setQueryable(layer.queryable);

    this.setLabelList(
      this.layer.getColumns().filter((column: string) => column !== "geometry")
    );
    this.setLabel(layer.label);

    this.setOpacity(layer.olLayer.getOpacity());

    if (layer.type === "kml") {
      this.disableColor("Function disabled for KML files.");
    } else {
      const legend =
        layer.type === "geojson" &&
        typeof layer.legend !== "undefined" &&
        layer.legend !== null;

      this.setColor(layer.color, legend);
    }
  }

  setLabelList(labels: string[]): void {
    this.labelOptGroup.innerHTML = "";
    labels.forEach((column: string) => {
      const option = document.createElement("option");

      option.value = column;
      option.innerText = column;

      this.labelOptGroup.append(option);
    });
  }

  setQueryable(queryable: boolean): void {
    document
      .querySelectorAll("#layer-queryable input[type=radio]")
      .forEach((input: HTMLInputElement) => {
        input.parentElement.classList.remove("active");
        input.checked = false;
      });

    if (queryable === true) {
      const input = document.getElementById(
        "layer-queryable-1"
      ) as HTMLInputElement;

      input.parentElement.classList.add("active");
      input.checked = true;
    } else {
      const input = document.getElementById(
        "layer-queryable-0"
      ) as HTMLInputElement;

      input.parentElement.classList.add("active");
      input.checked = true;
    }
  }

  getQueryable(): boolean {
    const inputs = document.querySelectorAll(
      "#layer-queryable input[type=radio]"
    ) as NodeListOf<HTMLInputElement>;
    const checked = [...inputs].filter((input) => input.checked).shift();

    return parseInt(checked.value) === 1;
  }

  setLabel(label: string): void {
    (this.labelOptGroup.parentElement as HTMLSelectElement).value = label;
  }

  getLabel(): string | null {
    const select = (this.labelOptGroup.parentElement as HTMLSelectElement);

    return select.value.length > 0 ? select.value : null;
  }

  disableColor(message?: string): void {
    this.colorInput.disabled = true;

    if (typeof message !== "undefined") {
      this.colorInputText.innerText = message;
      this.colorInputText.hidden = false;
    }
  }

  setColor(color: ColorLike | null, legend: boolean): void {
    this.colorInput.value = color !== null ? color.toString() : "";

    if (legend === true) {
      this.legendInput.parentElement.hidden = false;
      this.legendInput.checked = color === null;
      this.colorInput.disabled = color === null;
    }
  }

  getColor(): string | null {
    if (this.colorInput.disabled === false) {
      return this.colorInput.value.length > 0 ? this.colorInput.value : null;
    }

    return null;
  }

  setOpacity(opacity: number): void {
    this.opacityInput.value = (opacity * 100).toString();
    this.opacityInputText.innerText = `${opacity * 100}%`;
  }

  getOpacity(): number {
    return parseInt(this.opacityInput.value) / 100;
  }
}

export { SettingsModal as default };
