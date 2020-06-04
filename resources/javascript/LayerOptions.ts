"use strict";

export interface LayerOptions {
  layers?: string[];
  maxZoom?: number;
  proxy?: boolean;
  type: "wms" | "wmts";
  url: string;
}

export { LayerOptions as default };
