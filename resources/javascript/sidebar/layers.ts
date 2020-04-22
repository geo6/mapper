"use strict";

import btnLegend from "./layers/components/btn-legend";
import btnRemove from "./layers/components/btn-remove";
import btnSettings from "./layers/components/btn-settings";
import btnZoom from "./layers/components/btn-zoom";

export default function (
  type: string,
  index: number,
  name: string,
  title: string,
  queryable: boolean,
  zoom: boolean,
  legend: HTMLImageElement | HTMLCanvasElement
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.style.lineHeight = "31px";
  li.dataset.index = index.toString();
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

  const divName = document.createElement("div");
  divName.className = "layer-name text-nowrap text-truncate";
  divName.title = name;
  divName.innerText = title;
  if (queryable === true) {
    divName.innerHTML =
      '<i class="fas fa-fw fa-info-circle"></i> ' + divName.innerHTML;
  }
  div.append(divName);

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

  document.getElementById("layers-list").append(li);

  return li;
}
