"use strict";

import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";

export default function (source: VectorSource, coordinate: Coordinate): Feature[] {
  return source.getFeaturesAtCoordinate(coordinate);
}