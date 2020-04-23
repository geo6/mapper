"use strict";

import File from "../file";

export function init(type: string, files: Array<{}>): void {
  window.app[type] = [];

  files.forEach((file) => {
    const f = new File(
      type,
      file.identifier,
      file.name,
      file.title,
      file.description,
      true
    );

    window.app[type].push(f);

    if (f.type === "geojson") {
      fetch(f.url)
        .then((response) => response.json())
        .then((json) => {
          f.content = json;
          f.displayInList();
        });
    } else {
      f.displayInList();
    }
  });
}

export function apply(type: string): void {
  document
    .querySelectorAll(`#modal-layers-files-${type} .list-group-item`)
    .forEach((element: HTMLLIElement, index: number) => {
      const active = element.classList.contains("list-group-item-primary");
      const proj =
        element.querySelector("select") !== null
          ? (element.querySelector("select") as HTMLSelectElement).value
          : null;

      if (active === true) {
        window.app[type][index].addToMap(proj);
        window.app[type][index].displayInSidebar();

        element.classList.remove("list-group-item-primary");
      }
    });
}
