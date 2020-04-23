"use strict";

import KML from "ol/format/KML";
import VectorSource from "ol/source/Vector";

import File from "../../file";

export default function (file: File): VectorSource {
  return new VectorSource({
    url: file.url,
    format: new KML(),
  });
}
