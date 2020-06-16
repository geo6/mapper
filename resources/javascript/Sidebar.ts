"use strict";

import "sidebar-v2/css/ol3-sidebar.css";

import File from "./layers/File";
import WMS from "./layers/WMS";
import WMTS from "./layers/WMTS";

require("sidebar-v2/js/jquery-sidebar.js");

export class Sidebar {
  sidebar: any;

  constructor(element: HTMLElement) {
    this.sidebar = $(element).sidebar();
  }

  open(id: string): void {
    this.sidebar.open(id);
  }

  close(): void {
    this.sidebar.close();
  }

  addLayer(layer: File | WMS | WMTS, index?: number): HTMLLIElement {
    const li = layer.sidebarElement;

    if (typeof index === "undefined") {
      document.getElementById("layers-list").append(li);
    } else if (index === 0) {
      document.getElementById("layers-list").prepend(li);
    } else {
      document.getElementById("layers-list").children[index - 1].after(li);
    }

    return li;
  }
}

export { Sidebar as default };
