"use strict";

import $ from "jquery";

import "bootstrap/js/dist/tooltip";

import File from "../../File";
import btnLegend from "../../../sidebar/layers/components/btn-legend";
import btnOrder from "../../../sidebar/layers/components/btn-order";
import btnRemove from "../../../sidebar/layers/components/btn-remove";
import btnSettings from "../../../sidebar/layers/components/btn-settings";
import btnZoom from "../../../sidebar/layers/components/btn-zoom";
import GeoJSONLegend from "../geojson/legend";

function renderLegend(file: File): HTMLCanvasElement | null {
  let legend = null;

  if (
    file.type === "geojson" &&
    typeof file.legend !== "undefined" &&
    file.legend !== null &&
    Array.isArray(file.legend.values)
  ) {
    legend = GeoJSONLegend(file.legend.values);
  }

  return legend;
}

export default function (file: File): HTMLLIElement {
  const legend = renderLegend(file);
  const title =
    typeof file.title !== "undefined" && file.title !== null
      ? file.title
      : file.name;

  const element = document.createElement("li");
  element.className = "mb-1";
  // element.id = `layers-${file.type}-${file.getIndex()}`;

  const ul = document.createElement("ul");
  ul.className = "list-group";

  const li = document.createElement("li");
  li.className = "list-group-item";
  // li.id = `layers-${file.type}-${file.getIndex()}-0`;

  const div = document.createElement("div");
  div.className = "d-flex align-items-center justify-content-between";

  const divOrder = document.createElement("div");
  divOrder.className = "d-flex flex-column mr-2";
  divOrder.style.lineHeight = "0.5";
  divOrder.append(...btnOrder(file.type, file));
  div.append(divOrder);

  const divName = document.createElement("div");
  divName.className = "flex-fill layer-name text-nowrap text-truncate";
  divName.title = file.name;
  if (file.queryable === true) {
    divName.innerHTML = `<i class="fas fa-fw fa-info-circle"></i> ${title}`;
  } else {
    divName.innerHTML = title;
  }
  div.append(divName);

  $(divName).tooltip();

  const divButtons = document.createElement("div");
  divButtons.className = "btn-group btn-group-sm";
  divButtons.append(btnZoom(file.type, file));
  divButtons.append(btnLegend(legend));
  divButtons.append(btnSettings(file.type, file));
  divButtons.append(btnRemove(file.type, file));
  div.append(divButtons);

  li.append(div);

  if (legend !== null) {
    const divLegend = document.createElement("div");
    divLegend.className = "layer-legend";
    divLegend.hidden = true;
    divLegend.append(legend);
    li.append(divLegend);
  }

  ul.append(li);
  element.append(ul);

  return element;
}
