"use strict";

import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

import WMS from "../../WMS";
import { update as updateSidebarElement } from "./sidebar";

import { layerGroup } from "../../../map/layerGroup";

export default function (service: WMS, names: string[]): void {
  if (names.length > 0) {
    if (service.olLayer === null) {
      service.olLayer = new TileLayer({
        source: new TileWMS({
          params: {
            LAYERS: names,
          },
          projection: service.projection,
          url: service.capabilities.Service.OnlineResource,
        }),
      });

      const layers = names.map((name: string) =>
        service.layers.find((layer) => layer.Name === name)
      );
      updateSidebarElement(service, layers);

      layerGroup.getLayers().push(service.olLayer);
    } else {
      const source = service.olLayer.getSource() as TileWMS;
      const params = source.getParams();

      const layers = params.LAYERS.concat(names).map((name: string) =>
        service.layers.find((layer) => layer.Name === name)
      );
      updateSidebarElement(service, layers);

      source.updateParams({
        LAYERS: params.LAYERS.concat(names),
      });
    }
  }
}
