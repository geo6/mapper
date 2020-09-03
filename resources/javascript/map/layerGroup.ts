"use strict";

import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";

import File from "../layers/File";
import WMS from "../layers/WMS";
import WMTS from "../layers/WMTS";

import { files, services } from "../main";

function find(olLayer: BaseLayer): File | WMS | WMTS {
  const searchFile = Object.keys(files)
    .map((type: string) => {
      const file = files[type].find((file: File) => file.olLayer === olLayer);

      if (typeof file !== "undefined") {
        return file;
      }
    })
    .filter((file) => typeof file !== "undefined");

  if (searchFile.length > 0) {
    return searchFile[0];
  }

  const searchService = Object.keys(services)
    .map((type: string) => {
      const service = services[type].find(
        (service: WMS | WMTS) =>
          (service as WMS).olLayer === olLayer ||
          (service as WMTS).olLayers === olLayer
      );

      if (typeof service !== "undefined") {
        return service;
      }
    })
    .filter((service) => typeof service !== "undefined");

  if (searchService.length > 0) {
    return searchService[0];
  }

  return null;
}

export const layerGroup: LayerGroup = new LayerGroup();

layerGroup.getLayers().on("add", (event) => {
  const { index } = event;
  const layer = find(event.element);

  if (layer !== null) {
    layer.addToSidebar(index);
  }
});
layerGroup.getLayers().on("remove", (event) => {
  const layer = find(event.element);

  if (layer !== null) {
    layer.sidebarElement.remove();
  }
});
