import { AttributionLike } from "ol/source/Source";

export interface BaseLayerOptions {
  mode: string;
  url: string;
  attributions?: AttributionLike;
  maxZoom?: number;
  layer?: string; // WMTS
  layers?: string[]; // WMS
}

export { BaseLayerOptions as default };
