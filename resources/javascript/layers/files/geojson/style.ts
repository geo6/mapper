"use strict";

import Feature from "ol/Feature";

import LegendOptions from "../../../_interface/LegendOptions";

export default function (
  feature: Feature,
  legend?: LegendOptions | null
): void {
  if (typeof legend === "undefined" || legend === null) return;

  const properties = feature.getProperties();
  const { column, values } = legend;

  if (column === null) return;

  const l = values.find((val) => val.value === properties[column])
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
