"use strict";

import createLI from "./list";
import searchPixel from "./searchPixel";
import displayCoordinate from "./coordinate";

import { sidebar, map, files, services } from "../../main";
import { marker, markerLayer } from "../../map/marker";
import { drawControl } from "../draw";
import { FeatureLike } from "ol/Feature";

export default function (): void {
  map.on("singleclick", (event) => {
    const coordinate = map.getCoordinateFromPixel(event.pixel);

    const listElement = document.getElementById("info-list");
    const detailsElement = document.getElementById("info-details");

    listElement.innerHTML = "";
    listElement.hidden = false;
    detailsElement.innerHTML = "";
    detailsElement.hidden = true;

    marker.setGeometry(null);
    markerLayer.setVisible(false);

    displayCoordinate(coordinate);

    let count = 0;

    // Draw
    const features = searchPixel(drawControl.olLayer, event.pixel);

    count += features.length;

    if (features.length > 0) {
      listElement.append(
        createLI("Draw", features, {
          list: listElement,
          details: detailsElement,
        })
      );
    }

    // Files
    files.csv
      .filter((file) => file.olLayer !== null && file.queryable === true)
      .forEach((file) => {
        const features = searchPixel(file.olLayer, event.pixel);

        count += features.length;

        if (features.length > 0) {
          listElement.append(
            createLI(
              file.title || file.name,
              features,
              {
                list: listElement,
                details: detailsElement,
              },
              file.label
            )
          );
        }
      });
    files.geojson
      .filter((file) => file.olLayer !== null && file.queryable === true)
      .forEach((file) => {
        const features = searchPixel(file.olLayer, event.pixel);

        count += features.length;

        if (features.length > 0) {
          listElement.append(
            createLI(
              file.title || file.name,
              features,
              {
                list: listElement,
                details: detailsElement,
              },
              file.label
            )
          );
        }
      });
    files.gpx
      .filter((file) => file.olLayer !== null && file.queryable === true)
      .forEach((file) => {
        const features = searchPixel(file.olLayer, event.pixel);

        count += features.length;

        if (features.length > 0) {
          listElement.append(
            createLI(
              file.title || file.name,
              features,
              {
                list: listElement,
                details: detailsElement,
              },
              file.label
            )
          );
        }
      });
    files.kml
      .filter((file) => file.olLayer !== null && file.queryable === true)
      .forEach((file) => {
        const features = searchPixel(file.olLayer, event.pixel);

        count += features.length;

        if (features.length > 0) {
          listElement.append(
            createLI(
              file.title || file.name,
              features,
              {
                list: listElement,
                details: detailsElement,
              },
              file.label
            )
          );
        }
      });

    // Services
    const requests = [];

    services.wms.forEach(async (service) => {
      if (service.olLayer !== null) {
        requests.push(service.getFeatureInfo(event.coordinate));
      }
    });

    Promise.all(requests).then((results: FeatureLike[][]) => {
      count += results.reduce(
        (accumulator, currentValue) => accumulator + currentValue.length,
        0
      );
    });

    // Open sidebar
    Array.from(document.querySelectorAll(".sidebar-tabs > ul > li"))
      .filter(
        (element: HTMLLIElement) =>
          element.querySelector('a[href="#info"]') !== null
      )[0]
      .classList.remove("disabled");

    if (count === 1) {
      listElement.querySelector("ol > li").dispatchEvent(new MouseEvent("click"));
    }

    sidebar.open("info");


  });
}
