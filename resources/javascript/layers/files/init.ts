"use strict";

import File from "../File";
import FileOptions from "../../FileOptions";

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
      {
        description: file.description,
        label: file.label,
        legend: file.legend,
        title: file.title,
      },
      file.filter,
      true
    );

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
