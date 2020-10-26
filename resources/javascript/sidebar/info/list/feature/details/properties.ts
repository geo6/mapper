"use strict";

import { check as checkURL, display as displayURL } from "./properties/url";
import { check as checkFile, display as displayFile } from "./properties/file";

export default function (
  properties: Record<string, any>
): HTMLTableRowElement[] {
  const rows: HTMLTableRowElement[] = [];

  Object.keys(properties).forEach((key: string) => {
    const value = properties[key] || null;

    const tr = document.createElement("tr");

    const th = document.createElement("th");

    th.innerText = key;

    tr.append(th);

    const td = document.createElement("td");

    if (value === null) {
      td.className = "text-muted font-italic";
      td.innerText = "NULL";
    } else {
      if (checkURL(value) !== false) {
        const url = displayURL(value);

        td.append(url);
      } else if (checkFile(value) !== false) {
        td.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        displayFile(value).then((file: HTMLAnchorElement | string) => {
          td.innerHTML = "";
          td.append(file);
        });
      } else {
        td.innerText = value.toString();
      }
    }

    tr.append(td);

    rows.push(tr);
  });

  return rows;
}
