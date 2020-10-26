"use strict";

import { Coordinate } from "ol/coordinate";
import { FeatureLike } from "ol/Feature";
import Layer from "ol/layer/Layer";

import searchPixel from "./searchPixel";

import { map } from "../../main";

export default function (layer: Layer, coordinate: Coordinate): FeatureLike[] {
  return searchPixel(layer, map.getPixelFromCoordinate(coordinate));
}
