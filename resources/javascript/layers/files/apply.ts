"use strict";

import { files } from "../../main";

export default function (type: string): void {
  document
    .querySelectorAll(`#modal-layers-files-${type} .list-group-item`)
    .forEach((element: HTMLLIElement) => {
      const active = element.classList.contains("list-group-item-primary");
      const proj =
        element.querySelector("select") !== null
          ? (element.querySelector("select") as HTMLSelectElement).value
          : null;
      const index = parseInt(element.dataset.index);

      if (active === true) {
        files[type][index].addToMap(proj);

        element.classList.remove("list-group-item-primary");
      }
    });
}
