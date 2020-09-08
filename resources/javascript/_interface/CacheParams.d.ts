import { Coordinate } from "ol/coordinate";

export interface CacheParams {
  baselayer: string | null;
  coordinate: Coordinate | null;
  zoom: number | null;
}

export { CacheParams as default };
