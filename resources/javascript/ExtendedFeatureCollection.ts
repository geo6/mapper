"use strict";

export interface ExtendedFeatureCollection extends GeoJSON.FeatureCollection {
  type: "FeatureCollection";
  features: Array<
    GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.GeoJsonProperties>
  >;
  legend: Array<{
    color: string;
    text: string;
    value?: string;
    symbol?: string;
    size?: number;
  }>;
  legendColumn?: string;
}

export { ExtendedFeatureCollection as default };
