"use strict";

import WMS from "../../WMS";

export default function (service: WMS): HTMLUListElement {
  const ul = document.createElement("ul");
  ul.className = "list-group mb-3";

  service.layers.forEach((layer) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.name = layer.Name;
    li.id = `wms-${service.getIndex()}-${layer.Name}`;

    li.addEventListener("click", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      li.classList.toggle("list-group-item-primary");
    });

    const div = document.createElement("div");

    const spanName = document.createElement("span");
    spanName.className = "badge bg-secondary float-end";
    spanName.innerText = layer.Name;
    div.append(spanName);

    if (layer.queryable === true) {
      const icon = document.createElement("i");
      icon.className = "fas fa-info-circle mr-1";
      if (service.mixedContent === true) {
        icon.classList.add("text-light");
        icon.style.cursor = "help";
        icon.title =
          "GetFeatureInfo is disabled because of Mixed Active Content.";
      }
      div.append(icon);
    }

    div.append(layer.Title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1"));

    li.append(div);

    if (typeof layer.Abstract !== "undefined" && layer.Abstract !== "") {
      const pAbstract = document.createElement("p");
      pAbstract.className = "text-info small";
      pAbstract.innerHTML = layer.Abstract.replace(
        /(\r\n|\n\r|\r|\n)/g,
        "<br>" + "$1"
      );
      li.append(pAbstract);
    }

    ul.append(li);
  });

  return ul;
}
