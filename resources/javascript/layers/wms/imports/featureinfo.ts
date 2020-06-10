"use strict";

import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";
import TileWMS from "ol/source/TileWMS";

import WMS from "../WMS";

import { map } from "../../../main";

export default async function (
  service: WMS,
  layerName: string,
  coordinate: Coordinate
): Promise<{
  layer: string;
  features: Feature[];
}> {
  const source = service.olLayer.getSource() as TileWMS;
  const view = map.getView();

  const formats = service.capabilities.Capability.Request.GetFeatureInfo.Format;

  let format = null;
  if (formats.indexOf("application/vnd.ogc.gml") !== -1) {
    format = "application/vnd.ogc.gml";
  } else if (formats.indexOf("application/vnd.ogc.wms_xml") !== -1) {
    format = "application/vnd.ogc.wms_xml";
  } else if (formats.indexOf("text/xml") !== -1) {
    format = "text/xml";
  }

  if (format === null) {
    throw new Error(
      `Unable to GetFeatureInfo on the WMS service "${service.capabilities.Service.Title}" !` +
        ` It supports only "${formats.join('", "')}".`
    );
  }

  const layer = service.layers.find((layer) => {
    return layer.Name === layerName;
  });

  if (
    typeof layer !== "undefined" &&
    layer.queryable === true &&
    service.mixedContent === false
  ) {
    const url = source.getFeatureInfoUrl(
      coordinate,
      view.getResolution(),
      service.projection,
      {
        FEATURE_COUNT: 99,
        INFO_FORMAT: format,
        QUERY_LAYERS: [layer.Name],
      }
    );

    const response = await fetch(url);

    if (response.ok === true) {
      const xml = await response.text();

      return Promise.resolve({
        layer: layer.Name,
        features:
          response === null ? [] : new WMSGetFeatureInfo().readFeatures(xml),
      });
    }
  }

  return null;
}
