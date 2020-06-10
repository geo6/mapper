"use strict";

import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

import WMS from "../WMS";

import { map } from "../../../main";

export default function (service: WMS, layers: string[]): void {
  console.log("map", layers);

  if (layers.length > 0) {
    if (service.olLayer === null) {
      service.olLayer = new TileLayer({
        source: new TileWMS({
          params: {
            LAYERS: layers,
          },
          projection: service.projection,
          url: service.capabilities.Service.OnlineResource,
        }),
      });

      map.addLayer(service.olLayer);
    } else {
      const source = service.olLayer.getSource() as TileWMS;
      const params = source.getParams();

      console.log("map", "updateParams", params.LAYERS.concat(layers));

      source.updateParams({
        LAYERS: params.LAYERS.concat(layers),
      });
    }
  }
}
