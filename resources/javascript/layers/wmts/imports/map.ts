"use strict";

import TileLayer from "ol/layer/Tile";
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS";

import WMTS from "../../WMTS";
import { update as updateSidebarElement } from "./sidebar";

import { layerGroupServices } from "../../../map/layerGroup";

export default function (service: WMTS, names: string[]): void {
  if (names.length > 0) {
    names.forEach((name) => {
      const layer = new TileLayer({
        source: new WMTSSource(
          optionsFromCapabilities(service.capabilities, {
            layer: name,
            projection: service.projection,
          })
        ),
        zIndex: 100,
      });

      service.olLayers.getLayers().push(layer);
    });

    const loaded = service.olLayers
      .getLayersArray()
      .map((layer: TileLayer) => (layer.getSource() as WMTSSource).getLayer());

    const layers = loaded.map((name: string) =>
      service.layers.find((layer) => layer.Identifier === name)
    );
    updateSidebarElement(service, layers);
  }

  const intersect = layerGroupServices
    .getLayersArray()
    .filter((layer: TileLayer) =>
      service.olLayers.getLayersArray().includes(layer)
    );

  if (intersect.length === 0) {
    layerGroupServices.getLayers().push(service.olLayers);
  }
}
