"use strict";

import GeoJSON from "ol/format/GeoJSON";
import VectorSource, { VectorSourceEvent } from "ol/source/Vector";

import File from "../File";
import GeoJSONStyle from "./geojson/style";

export default function (file: File): VectorSource {
  const source = new VectorSource({
    url: file.url,
    format: new GeoJSON(),
  });

  source.on("addfeature", (event: VectorSourceEvent) => {
    GeoJSONStyle(event.feature, file.legend);
  });

  return source;
}
