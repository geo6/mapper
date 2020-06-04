"use strict";

export default function generateLayersList(service, layers) {
  const ul = document.createElement("ul");

  $(ul).addClass("list-group mb-3");

  for (let i = 0; i < layers.length; i++) {
    const li = document.createElement("li");
    const div = document.createElement("div");

    $(li)
      .attr("id", `wms-${service.getIndex()}-${layers[i].Name}`)
      .data({
        name: layers[i].Name
      })
      .addClass("list-group-item")
      .on("click", (event) => {
        event.stopPropagation();

        $(event.delegateTarget).toggleClass("list-group-item-primary");
      })
      .appendTo(ul);

    $(document.createElement("span"))
      .addClass("badge badge-light float-right")
      .text(layers[i].Name)
      .appendTo(div);

    let icon = "";
    if (layers[i].queryable === true) {
      if (service.mixedContent === true) {
        icon = "<i class=\"fas fa-info-circle text-light\" style=\"cursor:help;\" title=\"GetFeatureInfo is disabled because of Mixed Active Content.\"></i> ";
      } else {
        icon = "<i class=\"fas fa-info-circle\"></i> ";
      }
    }

    $(div)
      .append([
        icon,
        layers[i].Title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1")
      ])
      .appendTo(li);

    if (typeof layers[i].Abstract !== "undefined" && layers[i].Abstract !== "") {
      const p = document.createElement("p");

      $(p)
        .addClass("text-info small")
        .html(layers[i].Abstract.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1"))
        .appendTo(li);
    }

    if (typeof layers[i].Layer !== "undefined") {
      $(li).append(generateLayersList(service, layers[i].Layer));
    }
  }

  return ul;
}
