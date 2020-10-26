"use strict";

import { FeatureLike } from "ol/Feature";
import Layer from "ol/layer/Layer";
import { Pixel } from "ol/pixel";

import { map } from "../../main";

export default function (layer: Layer, pixel: Pixel): FeatureLike[] {
  return map.getFeaturesAtPixel(pixel, {
    layerFilter: (l) => l === layer,
  });
}
