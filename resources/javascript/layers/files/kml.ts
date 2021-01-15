"use strict";

import KML from "ol/format/KML";
import VectorSource from "ol/source/Vector";

import File from "../../File";

export default function (file: File, extractStyles = true): VectorSource {
  return new VectorSource({
    url: file.url,
    format: new KML({ extractStyles }),
  });
}
