"use strict";

import "sidebar-v2/css/ol3-sidebar.css";

import SidebarControl from "sidebar-v2/js/ol5-sidebar";

import File from "./layers/File";
import WMS from "./layers/WMS";
import WMTS from "./layers/WMTS";
import ShareSidebar from "./sidebar/ShareSidebar";

import { layerGroupFiles } from "./map/layerGroup";

export class Sidebar {
  private sidebar: SidebarControl;

  private share: ShareSidebar;

  constructor(element: string) {
    this.sidebar = new SidebarControl({
      element,
      position: "left",
    });

    this.share = new ShareSidebar();

    document.querySelectorAll("#sidebar a").forEach((element) => {
      element.addEventListener("click", () => {
        const active =
          element.parentElement.classList.contains("active") === false;

        switch (element.hash) {
          case "#share":
            if (active === true) {
              this.share.update();
            }
            break;
        }
      });
    });
  }

  open(id: string): void {
    this.sidebar.open(id);
  }

  close(): void {
    this.sidebar.close();
  }

  addLayer(
    type: "csv" | "geojson" | "gpx" | "kml" | "wms" | "wmts",
    layer: File | WMS | WMTS,
    index?: number
  ): HTMLLIElement {
    const li = layer.sidebarElement;

    let element = null;
    if (["wms", "wmts"].indexOf(type) > -1) {
      element = document.getElementById(
        "layers-list-services"
      ) as HTMLUListElement;
    } else if (["csv", "geojson", "gpx", "kml"].indexOf(type) > -1) {
      element = document.getElementById(
        "layers-list-files"
      ) as HTMLUListElement;
    } else {
      throw new Error(`Invalid layer type "${type}".`);
    }

    if (
      typeof index === "undefined" ||
      element.children.length === 0 ||
      index === layerGroupFiles.getLayers().getLength() - 1
    ) {
      element.prepend(li);
    } else if (index === 0) {
      element.append(li);
    } else {
      element.children[element.children.length - index].before(li);
    }

    return li;
  }
}

export { Sidebar as default };
