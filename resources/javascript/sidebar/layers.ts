"use strict";

import { Tooltip } from 'bootstrap';

import btnLegend from "./layers/components/btn-legend";
import btnOrder from "./layers/components/btn-order";
import btnRemove from "./layers/components/btn-remove";
import btnSettings from "./layers/components/btn-settings";
import btnZoom from "./layers/components/btn-zoom";
import File from "../layers/File";
import WMS from "../layers/WMS";
import WMTS from "../layers/WMTS";

export default function (
  type: "csv" | "geojson" | "gpx" | "kml" | "wms" | "wmts",
  layer: File | WMS | WMTS,
  name: string,
  title: string,
  queryable: boolean,
  zoom: boolean,
  legend: HTMLImageElement | HTMLCanvasElement
): HTMLLIElement {
  const index = layer.getIndex().toString();

  const li = document.createElement("li");
  li.className = "list-group";
  li.style.lineHeight = "31px";
  li.dataset.index = index;
  li.dataset.layer = name;
  li.dataset.type = type;

  if (["wms", "wmts"].indexOf(type) > -1) {
    const pointer = document.querySelectorAll(
      `#layers .list-group > li[id^="layers-${type}-${index}-"]`
    ).length;

    li.id = `layers-${type}-${index}-${pointer}`;
  } else if (["csv", "geojson", "gpx", "kml"].indexOf(type) > -1) {
    const pointer = document.querySelectorAll(
      `#layers .list-group > li[id^="layers-${type}-"]`
    ).length;

    li.id = `layers-${type}-${pointer}`;
  } else {
    throw new Error(`Invalid layer type "${type}".`);
  }

  const div = document.createElement("div");
  div.className = "d-flex w-100 justify-content-between";

  const divOrder = document.createElement("div");
  divOrder.className = "d-flex flex-column mr-2";
  divOrder.style.lineHeight = "0.5";
  divOrder.append(...btnOrder(type, layer));
  div.append(divOrder);

  const divName = document.createElement("div");
  divName.className = "flex-fill layer-name text-nowrap text-truncate";
  divName.title = name;
  divName.innerText = title;
  if (queryable === true) {
    divName.innerHTML =
      '<i class="fas fa-fw fa-info-circle"></i> ' + divName.innerHTML;
  }
  div.append(divName);

  const tooltip = new Tooltip(divName);

  const divButtons = document.createElement("div");
  divButtons.className = "btn-group btn-group-sm";
  divButtons.append(btnZoom(zoom, type, index, name));
  divButtons.append(btnLegend(legend));
  divButtons.append(btnSettings(type, index, name));
  divButtons.append(btnRemove(type, index, name));
  div.append(divButtons);

  li.append(div);

  if (typeof legend !== "undefined" && legend !== null) {
    const divLegend = document.createElement("div");
    divLegend.className = "layer-legend";
    divLegend.hidden = true;
    divLegend.append(legend);
    li.append(divLegend);
  }

  if (["wms", "wmts"].indexOf(type) > -1) {
    document.getElementById("layers-list-services").append(li);
  } else if (["csv", "geojson", "gpx", "kml"].indexOf(type) > -1) {
    document.getElementById("layers-list-files").append(li);
  }

  return li;
}
