"use strict";

import File from "../File";
import FileOptions from "../../_interface/FileOptions";

import { files } from "../../main";

export default function (
  type: "csv" | "geojson" | "gpx" | "kml",
  filesOptions: Array<FileOptions>
): void {
  files[type] = [];

  filesOptions
    .sort((file1: FileOptions, file2: FileOptions) => {
      return Math.sign(file1.order - file2.order);
    })
    .forEach((file: FileOptions) => {
      const f = new File(
        type,
        file.identifier,
        file.name,
        {
          collection: file.collection,
          description: file.description,
          label: file.label,
          legend: file.legend,
          queryable: file.queryable,
          title: file.title,
        },
        file.filter,
        true
      );
      console.log(file.name, file.order);

      files[type].push(f);

      const index = files[type].indexOf(f);
      const projection =
        f.type === "csv" && typeof file.projection !== "undefined"
          ? file.projection
          : null;

      f.displayInList(index);

      if (file.default === true) {
        f.addToMap(projection);
        // f.displayInSidebar(index);
      }
    });
}
