"use strict";

import File from "../File";
import ExtendedFeatureCollection from "../ExtendedFeatureCollection";
import { applyStyle } from "./files/geojson";

import { files } from "../main";

export function init(type: string, filesOptions: Array<{}>): void {
  files[type] = [];

  filesOptions.forEach((file: File) => {
    const f = new File(
      type,
      file.identifier,
      file.name,
      file.title,
      file.description,
      true
    );

    files[type].push(f);

    const index = files[type].indexOf(f);

    if (f.type === "geojson") {
      fetch(f.url)
        .then((response: Response) => response.json())
        .then(
          (
            json:
              | GeoJSON.FeatureCollection
              | GeoJSON.Feature
              | ExtendedFeatureCollection
          ) => {
            f.content = json;
            if (
              typeof f.content["legend"] !== "undefined" &&
              typeof f.content["legendColumn"] !== "undefined"
            ) {
              f.content = applyStyle(f.content as ExtendedFeatureCollection);
            }
            f.displayInList(index);

            if (file.default === true) {
              f.addToMap(null);
              f.displayInSidebar(index);
            }
          }
        );
    } else {
      f.displayInList(index);

      if (file.default === true) {
        f.addToMap(
          f.type === "csv" && typeof file.projection !== "undefined"
            ? file.projection
            : null
        );
        f.displayInSidebar(index);
      }
    }
  });
}

export function apply(type: string): void {
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
        files[type][index].displayInSidebar(index);

        element.classList.remove("list-group-item-primary");
      }
    });
}
