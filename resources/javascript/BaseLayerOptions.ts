"use strict";

import { AttributionLike } from "ol/source/Source";

export interface BaseLayerOptions {
  mode: string;
  url: string;
  attributions?: AttributionLike;
  maxZoom?: number;
  layers?: string[] | string;
}

export { BaseLayerOptions as default };
