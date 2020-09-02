"use strict";

import Resumable from "resumablejs";

import File from "./layers/File";
import { applyStyle } from "./layers/files/geojson";
import ExtendedFeatureCollection from "./ExtendedFeatureCollection";

import { baseUrl, files } from "./main";

export default function (): void {
  const resumable = new Resumable({
    fileType: ["csv", "geojson", "gpx", "json", "kml"],
    target: `${baseUrl}upload`,
  });

  resumable.assignBrowse(document.getElementById("btn-layers-upload"), false);

  resumable.on("filesAdded", (uploadFiles: Resumable.ResumableFile[]) => {
    const progressbar = document.querySelector(
      "#progress-upload > .progress-bar"
    ) as HTMLDivElement;
    progressbar.setAttribute("aria-valuenow", "0");
    progressbar.style.width = "0%";

    const count = {
      csv: 0,
      geojson: 0,
      gpx: 0,
      kml: 0,
    };

    uploadFiles.forEach((file: Resumable.ResumableFile) => {
      const extension =
        file.fileName.substring(
          file.fileName.lastIndexOf(".") + 1,
          file.fileName.length
        ) || file.fileName;

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.style.opacity = "0.33";
      li.dataset.identifier = file.uniqueIdentifier;
      li.innerHTML = `<strong>${file.fileName}</strong>`;

      switch (extension.toLowerCase()) {
        case "csv": {
          count.csv++;

          li.id = `file-csv-${files.csv.length}`;

          document
            .querySelector("#modal-layers-files-csv > .list-group")
            .append(li);
          break;
        }
        case "json":
        case "geojson": {
          count.geojson++;

          li.id = `file-geojson-${files.geojson.length}`;

          document
            .querySelector("#modal-layers-files-geojson > .list-group")
            .append(li);
          break;
        }
        case "gpx": {
          count.gpx++;

          li.id = `file-gpx-${files.gpx.length}`;

          document
            .querySelector("#modal-layers-files-gpx > .list-group")
            .append(li);
          break;
        }
        case "kml": {
          count.kml++;

          li.id = `file-kml-${files.kml.length}`;

          document
            .querySelector("#modal-layers-files-kml > .list-group")
            .append(li);
          break;
        }
      }
    });

    const fileTypeSelect = document.getElementById(
      "modal-layers-select"
    ) as HTMLSelectElement;

    if (Math.max(...Object.values(count)) === count.geojson) {
      fileTypeSelect.value = "geojson";
    } else if (Math.max(...Object.values(count)) === count.csv) {
      fileTypeSelect.value = "csv";
    } else if (Math.max(...Object.values(count)) === count.gpx) {
      fileTypeSelect.value = "gpx";
    } else if (Math.max(...Object.values(count)) === count.kml) {
      fileTypeSelect.value = "kml";
    }

    fileTypeSelect.dispatchEvent(new Event("change"));

    resumable.upload();
  });

  resumable.on("progress", () => {
    const pct = Math.round(resumable.progress() * 100);

    const progressbar = document.querySelector(
      "#progress-upload > .progress-bar"
    ) as HTMLDivElement;
    progressbar.setAttribute("aria-valuenow", `${pct}`);
    progressbar.style.width = `${pct}%`;
  });

  resumable.on(
    "fileSuccess",
    (file: Resumable.ResumableFile, message: string) => {
      const extension =
        file.fileName.substring(
          file.fileName.lastIndexOf(".") + 1,
          file.fileName.length
        ) || file.fileName;
      const { title, description, legend } = JSON.parse(message);

      let f = null;
      switch (extension.toLowerCase()) {
        case "csv":
          f = new File(
            "csv",
            file.uniqueIdentifier,
            file.fileName,
            { title, description, queryable: true },
            null,
            false
          );
          break;
        case "json":
        case "geojson":
          f = new File(
            "geojson",
            file.uniqueIdentifier,
            file.fileName,
            { title, description, legend, queryable: true },
            null,
            false
          );
          break;
        case "gpx":
          f = new File(
            "gpx",
            file.uniqueIdentifier,
            file.fileName,
            { title, description, queryable: true },
            null,
            false
          );
          break;
        case "kml":
          f = new File(
            "kml",
            file.uniqueIdentifier,
            file.fileName,
            { title, description, queryable: true },
            null,
            false
          );
          break;
      }

      if (f instanceof File) {
        files[f.type].push(f);

        const index = files[f.type].indexOf(f);

        const li = document.getElementById(`file-${f.type}-${index}`);

        f.displayInList(index, li);
      }
    }
  );
}
