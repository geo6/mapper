"use strict";

import Feature from "ol/Feature";

import LegendOptions from "../../../LegendOptions";

export default function (feature: Feature, legend: LegendOptions): void {
  const properties = feature.getProperties();
  const { column, values } = legend;

  const l =
    column !== null
      ? values.find((val) => val.value === properties[column])
      : values[0];

  if (typeof l !== "undefined") {
    const style = { color: l.color };

    if (typeof l.size !== "undefined" && l.size !== null) {
      Object.assign(style, { "marker-size": l.size });
    }
    if (typeof l.symbol !== "undefined" && l.symbol !== null) {
      Object.assign(style, { "marker-symbol": l.symbol });
    }

    feature.setProperties(style);
  }
}
