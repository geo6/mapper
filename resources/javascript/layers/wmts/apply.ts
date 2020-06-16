"use strict";

import { services } from "../../main";

export default function (index: number): void {
  const names: string[] = [];

  document
    .querySelectorAll(
      `#modal-layers-wmts-${index} .list-group-item.list-group-item-primary`
    )
    .forEach((element: HTMLLIElement) => {
      names.push(element.dataset.name);

      element.classList.remove("list-group-item-primary");
    });

  if (names.length > 0) {
    services.wmts[index].addToMap(names);
  }
}
