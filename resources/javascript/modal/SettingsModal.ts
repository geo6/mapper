"use strict";

export class SettingsModal {
  layer = null;

  constructor(element: HTMLElement) {
    element.querySelector("form").addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const labelInput = document.getElementById(
        "layer-label"
      ) as HTMLInputElement;

      this.layer.label = labelInput.value.length > 0 ? labelInput.value : null;

      const colorInput = document.getElementById(
        "layer-color"
      ) as HTMLInputElement;

      if (colorInput.disabled === false) {
        this.layer.color =
          colorInput.value.length > 0 ? colorInput.value : null;
      }

      this.layer.olLayer.changed();

      this.layer = null;

      $(element).modal("hide");
    });
  }
}

export { SettingsModal as default };
