"use strict";


import "bootstrap/js/dist/tooltip";

import WMTS from "../../WMTS";
import btnLegend from "../../../sidebar/layers/components/btn-legend";
// import btnOrder from "../../../sidebar/layers/components/btn-order";
import btnRemove from "../../../sidebar/layers/components/btn-remove";
import btnSettings from "../../../sidebar/layers/components/btn-settings";
import btnZoom from "../../../sidebar/layers/components/btn-zoom";

export function create(service: WMTS): HTMLLIElement {
  const element = document.createElement("li");
  element.className = "mb-1";
  // element.id = `layers-wmts-${service.getIndex()}`;

  const div = document.createElement("div");
  div.className = "small text-secondary";
  div.innerText = service.capabilities.ServiceIdentification.Title;

  element.append(div);

  const ul = document.createElement("ul");
  ul.className = "list-group";

  element.append(ul);

  return element;
}

function renderLegend(layer: unknown): HTMLImageElement | null {
  let legend = null;

  if (
    typeof layer.Style !== "undefined" &&
    layer.Style.length > 0 &&
    typeof layer.Style[0].LegendURL !== "undefined" &&
    layer.Style[0].LegendURL.length > 0
  ) {
    legend = document.createElement("img");
    legend.alt = `Legend "${layer.Name || layer.Identifier}"`;
    legend.classList.add("img-fluid");
    legend.src = layer.Style[0].LegendURL[0].href;
  }

  return legend;
}

export function update(service: WMTS, layers: unknown[]): HTMLLIElement {
  const element = service.sidebarElement;
  const ul = element.querySelector("ul.list-group");

  ul.innerHTML = "";

  layers.forEach((layer: unknown, index: number) => {
    const legend = renderLegend(layer);
    const name = layer.Name || layer.Identifier;

    let queryable = false;
    if (typeof layer.ResourceURL !== "undefined") {
      layer.ResourceURL.forEach((resource) => {
        if (
          resource.resourceType === "FeatureInfo" &&
          resource.format === "application/json"
        ) {
          queryable = true;

          return false;
        }
      });
    }

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.id = `layers-wmts-${service.getIndex()}-${index}`;

    const div = document.createElement("div");
    div.className = "d-flex align-items-center justify-content-between";

    // const divOrder = document.createElement("div");
    // divOrder.className = "d-flex flex-column mr-2";
    // divOrder.style.lineHeight = "0.5";
    // divOrder.append(...btnOrder(type, layer));
    // div.append(divOrder);

    const divName = document.createElement("div");
    divName.className = "flex-fill layer-name text-nowrap text-truncate";
    divName.title = name;
    divName.innerText = layer.Title;
    if (queryable === true) {
      if (service.mixedContent === true) {
        divName.innerHTML =
          '<i class="fas fa-fw fa-info-circle text-light" style="cursor: help;" title="GetFeatureInfo is disabled because of Mixed Active Content."></i> ' +
          divName.innerHTML;
      } else {
        divName.innerHTML =
          '<i class="fas fa-fw fa-info-circle"></i> ' + divName.innerHTML;
      }
    }
    div.append(divName);

    $(divName).tooltip();

    const divButtons = document.createElement("div");
    divButtons.className = "btn-group btn-group-sm";
    divButtons.append(btnZoom("wms", service, name));
    divButtons.append(btnLegend(legend));
    divButtons.append(btnSettings("wms", null));
    divButtons.append(btnRemove("wms", service, name));
    div.append(divButtons);

    li.append(div);

    if (typeof legend !== "undefined" && legend !== null) {
      const divLegend = document.createElement("div");
      divLegend.className = "layer-legend";
      divLegend.hidden = true;
      divLegend.append(legend);
      li.append(divLegend);
    }

    ul.append(li);
  });

  return element;
}
