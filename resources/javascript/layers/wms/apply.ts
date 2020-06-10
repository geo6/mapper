"use strict";

import { services } from "../../main";

export default function (index: number): void {
  const names: string[] = [];

  document
    .querySelectorAll(
      `#modal-layers-wms-${index} .list-group-item.list-group-item-primary`
    )
    .forEach((element: HTMLLIElement) => {
      names.push(element.dataset.name);

      element.classList.remove("list-group-item-primary");
    });

  console.log("apply", names);

  if (names.length > 0) {
    services.wms[index].addToMap(names);
    services.wms[index].addToSidebar(names);
  }
}
