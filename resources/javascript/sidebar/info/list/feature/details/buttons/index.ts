"use strict";

import { Geometry } from "ol/geom";

import createList from "./list";
import createLocate from "./locate";
import createNext from "./next";
import createPrev from "./prev";

export default function(geometry: Geometry, targets: { list: HTMLElement; details: HTMLElement; }): HTMLDivElement {
  const div = document.createElement("div");

  div.className = "mb-3";

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group mr-1";
  btnGroup.append(createPrev(targets));
  btnGroup.append(createNext(targets));
  div.append(btnGroup);

  div.append(createList(targets));

  div.append(createLocate(geometry));

  return div;
}