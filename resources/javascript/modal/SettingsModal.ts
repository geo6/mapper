"use strict";

export class SettingsModal {
  private element: HTMLElement;
  private form: HTMLFormElement;

  private labelSelect: HTMLSelectElement;
  private colorInput: HTMLInputElement;
  private colorInputText: HTMLElement;
  private opacityInput: HTMLInputElement;
  private opacityInputText: HTMLElement;

  private layer = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.form = this.element.querySelector("form");

    this.labelSelect = document.getElementById(
      "layer-label"
    ) as HTMLSelectElement;
    this.colorInput = document.getElementById(
      "layer-color"
    ) as HTMLInputElement;
    this.colorInputText = document.getElementById(
      "layer-color-text"
    ) as HTMLElement;
    this.opacityInput = document.getElementById(
      "layer-opacity"
    ) as HTMLInputElement;
    this.opacityInputText = document.getElementById(
      "layer-opacity-text"
    ) as HTMLElement;

    this.opacityInput.addEventListener("change", () => {
      this.opacityInputText.innerText = `${this.opacityInput.value}%`;
    });

    this.form.addEventListener("reset", () => {
      this.colorInput.disabled = false;

      this.colorInputText.innerText = "";
      this.colorInputText.hidden = true;
      this.opacityInputText.innerText = "";
    });

    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      this.layer.label = this.getLabel();
      this.layer.color = this.getColor();

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

  setLayer(layer, name: string): void {
    this.layer = layer;

    (this.element.querySelector(
      ".modal-body > span.font-weight-bold"
    ) as HTMLSpanElement).innerText = name;

    this.setLabelList(
      this.layer.getColumns().filter((column: string) => column !== "geometry")
    );
    this.setLabel(layer.label);

    this.setOpacity(layer.olLayer.getOpacity());

    if (
      layer.type === "geojson" &&
      typeof layer.legend !== "undefined" &&
      layer.legend !== null
    ) {
      this.disableColor("Function disabled because this layer has a legend.");
    } else if (layer.type === "kml") {
      this.disableColor("Function disabled for KML files.");
    } else {
      this.setColor(layer.color);
    }
  }

  setLabelList(labels: string[]): void {
    this.labelSelect.innerHTML = '<option value=""></option>';
    labels.forEach((column: string) => {
      const option = document.createElement("option");

      option.value = column;
      option.innerText = column;

      this.labelSelect.append(option);
    });
  }

  setLabel(label: string): void {
    this.labelSelect.value = label;
  }

  getLabel(): string | null {
    return this.labelSelect.value.length > 0 ? this.labelSelect.value : null;
  }

  disableColor(message?: string): void {
    this.colorInput.disabled = true;

    if (typeof message !== "undefined") {
      this.colorInputText.innerText = message;
      this.colorInputText.hidden = false;
    }
  }

  setColor(color: string): void {
    this.colorInput.value = color;
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
