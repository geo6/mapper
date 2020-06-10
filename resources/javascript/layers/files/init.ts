"use strict";

import File from "../../File";
import FileOptions from "../../FileOptions";
import ExtendedFeatureCollection from "../../ExtendedFeatureCollection";
import { applyStyle } from "./geojson";

import { files } from "../../main";

export default function (
  type: "csv" | "geojson" | "gpx" | "kml",
  filesOptions: Array<FileOptions>
): void {
  files[type] = [];

  filesOptions.forEach((file: FileOptions) => {
    const f = new File(
      type,
      file.identifier,
      file.name,
      file.title,
      file.description,
      file.filter,
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
              typeof f.content.legend !== "undefined" &&
              typeof f.content.legendColumn !== "undefined"
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
