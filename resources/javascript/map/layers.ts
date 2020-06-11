"use strict";

import initFile from "../layers/files/init";
import FileApplySelection from "../layers/files/apply";

import initWMS from "../layers/wms/init";
import WMSApplySelection from "../layers/wms/apply";

import initWMTS from "../layers/wmts/init";
import WMTSApplySelection from "../layers/wmts/apply";
import FileOptions from "../FileOptions";
import ServiceOptions from "../ServiceOptions";

function selectOnChange(event: Event): void {
  const element = event.currentTarget as HTMLSelectElement;
  const option = element
    .querySelectorAll("option")
    .item(element.selectedIndex) as HTMLOptionElement;
  const type = element.value;
  const dataset = option.dataset;

  const progressElement = document.querySelector(
    "#progress-upload"
  ) as HTMLDivElement;
  const helpElement = document.querySelector(
    "#modal-layers-format-help"
  ) as HTMLDivElement;

  progressElement.style.display = "none";
  helpElement.style.display = "none";

  document
    .querySelectorAll("#modal-layers-format-help > div")
    .forEach((element: HTMLDivElement) => {
      element.style.display = "none";
    });

  document
    .querySelectorAll("#modal-layers-layers > div")
    .forEach((element: HTMLDivElement) => {
      element.style.display = "none";
    });

  (document.querySelector(dataset.target) as HTMLDivElement).style.display = "";

  if (typeof dataset.upload !== "undefined" && dataset.upload === "true") {
    progressElement.style.display = "";
    helpElement.style.display = "";
    (document.querySelector(
      `#modal-layers-format-help-${type}`
    ) as HTMLDivElement).style.display = "";
  }
}

function applyOnClick(event: Event): void {
  event.preventDefault();

  const select = document.getElementById(
    "modal-layers-select"
  ) as HTMLSelectElement;
  const option = select.querySelectorAll("option").item(select.selectedIndex);
  const { index } = option.dataset;

  switch (option.closest("optgroup").id) {
    case "modal-layers-optgroup-files": {
      FileApplySelection(select.value);
      break;
    }
    case "modal-layers-optgroup-wms": {
      WMSApplySelection(index);
      break;
    }
    case "modal-layers-optgroup-wmts": {
      WMTSApplySelection(index);
      break;
    }
  }
}

export default function (
  services: {
    wms?: ServiceOptions[];
    wmts?: ServiceOptions[];
  },
  files: {
    csv?: FileOptions[];
    geojson?: FileOptions[];
    gpx?: FileOptions[];
    kml?: FileOptions[];
  }
): void {
  initFile("csv", files.csv || []);
  initFile("geojson", files.geojson || []);
  initFile("gpx", files.gpx || []);
  initFile("kml", files.kml || []);

  initWMS(services.wms);
  initWMTS(services.wmts);

  document
    .getElementById("modal-layers-select")
    .addEventListener("change", (event) => selectOnChange(event));

  document
    .getElementById("btn-layers-apply")
    .addEventListener("click", (event) => applyOnClick(event));
}