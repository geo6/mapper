"use strict";

import Control, { Options } from "ol/control/Control";

import saveAs from "file-saver";

import { customKey } from "../../main";

class MapExportControl extends Control {
  constructor(options?: Options) {
    const button = document.createElement("button");
    button.innerHTML = '<i class="fas fa-fw fa-camera"></i>';
    button.title = "Export map";

    const element = document.createElement("div");
    element.className = "ol-mapexport ol-unselectable ol-control";
    element.appendChild(button);

    super(
      Object.assign(options || {}, {
        element: element,
      })
    );

    button.addEventListener("click", this.handle.bind(this), false);
  }

  handle(): void {
    document.body.style.opacity = "0.3";

    this.getMap().once("rendercomplete", () => {
      const mapCanvas = document.createElement("canvas");

      const size = this.getMap().getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];

      const mapContext = mapCanvas.getContext("2d");

      document
        .querySelectorAll(".ol-layer canvas")
        .forEach((canvas: HTMLCanvasElement) => {
          if (canvas.width > 0) {
            const opacity = (canvas.parentNode as HTMLElement).style.opacity;

            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

            const transform = canvas.style.transform;
            const matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(",")
              .map(Number);
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );

            mapContext.drawImage(canvas, 0, 0);
          }
        });

      mapCanvas.toBlob((blob) => {
        if (customKey !== null) {
          saveAs(blob, `mapper-${customKey}.png`);
        } else {
          saveAs(blob, "mapper.png");
        }
      });

      document.body.style.opacity = "1";
    });

    this.getMap().renderSync();
  }
}

export { MapExportControl as default };
