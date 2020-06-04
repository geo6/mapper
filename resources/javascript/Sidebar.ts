"use strict";

import "sidebar-v2/css/ol3-sidebar.css";

import createLayerLI from "./sidebar/layers";

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

  addLayerInList(
    type: string,
    index: number,
    name: string,
    title: string,
    queryable: boolean,
    zoom: boolean,
    legend: HTMLImageElement | HTMLCanvasElement
  ): HTMLLIElement {
    const li = createLayerLI(type, index, name, title, queryable, zoom, legend);

    document.getElementById("layers-list").append(li);

    return li;
  }
}

export { Sidebar as default };
