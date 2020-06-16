"use strict";

import File from "../../../layers/File";
import WMS from "../../../layers/WMS";
import WMTS from "../../../layers/WMTS";

import { layerGroup } from "../../../map/layerGroup";

export default function (
  type: string,
  layer: File | WMS | WMTS
): HTMLAnchorElement[] {
  const aOrderUp = document.createElement("a");
  aOrderUp.href = "#";
  aOrderUp.innerHTML = '<i class="fas fa-caret-up"></i>';
  aOrderUp.addEventListener("click", (event: Event) => {
    event.preventDefault();

    const layers = layerGroup.getLayers();
    const index = layers.getArray().findIndex((l) => l === layer.olLayer);

    console.info("UP", type, index);

    if (index > 0) {
      layers.remove(layer.olLayer);
      layers.insertAt(index - 1, layer.olLayer);
    }
  });

  const aOrderDown = document.createElement("a");
  aOrderDown.href = "#";
  aOrderDown.innerHTML = '<i class="fas fa-caret-down"></i>';
  aOrderDown.addEventListener("click", (event: Event) => {
    event.preventDefault();

    const layers = layerGroup.getLayers();
    const index = layers.getArray().findIndex((l) => l === layer.olLayer);

    console.info("DOWN", type, index);

    if (index < layers.getLength() - 1) {
      layers.remove(layer.olLayer);
      layers.insertAt(index + 1, layer.olLayer);
    }
  });

  return [aOrderUp, aOrderDown];
}
