"use strict";

import TileLayer from "ol/layer/Tile";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";

import { map } from "../../../main";

export default function (wmts, layers) {
  if (typeof wmts !== "undefined" && layers.length > 0) {
    layers.forEach((layer) => {
      const name = layer.Identifier;

      if (typeof wmts.olLayers[name] === "undefined") {
        wmts.olLayers[name] = new TileLayer({
          source: new WMTS(
            optionsFromCapabilities(wmts.capabilities, {
              layer: name,
              projection: wmts.projection,
            })
          ),
        });
        map.addLayer(wmts.olLayers[name]);
      }
    });
  }
}
