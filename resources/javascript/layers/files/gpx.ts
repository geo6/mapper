"use strict";

import GPX from "ol/format/GPX";
import VectorSource from "ol/source/Vector";

import File from "../../File";

export default function (file: File): VectorSource {
  return new VectorSource({
    url: file.url,
    format: new GPX(),
  });
}
