"use strict";

import { toStringXY } from "ol/coordinate";
import {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "ol/geom";
import SimpleGeometry from "ol/geom/SimpleGeometry";
import { toLonLat } from "ol/proj";
import { getArea, getLength } from "ol/sphere";

import { map } from "../main";

/**
 * Display selected Feature geometry.
 *
 * @param {object} geometry Feature geometry.
 *
 * @returns {void}
 */
export default function (geometry: SimpleGeometry): void {
  const geometryType = geometry.getType();

  const divGeometry = document.getElementById(
    "info-details-geometry"
  ) as HTMLDivElement;
  const btnLocate = document.getElementById(
    "infos-details-btn-locate"
  ) as HTMLButtonElement;

  divGeometry.innerHTML = geometryType + "<br>";
  divGeometry.removeAttribute("hidden");

  btnLocate.removeAttribute("disabled");
  btnLocate.addEventListener("click", () => {
    const extent = geometry.getExtent();

    map.getView().fit(extent, {
      maxZoom: 18,
      padding: [15, 15, 15, 15],
    });
  });

  switch (geometryType) {
    case "Point": {
      const coordinates = (geometry as Point).getCoordinates();

      divGeometry.innerHTML += toStringXY(toLonLat(coordinates), 6) + "<br>";
      break;
    }
    case "MultiPoint": {
      const points = (geometry as MultiPoint).getPoints();

      divGeometry.innerHTML += `${points.length} point(s)<br>`;

      if (points.length === 1) {
        const coordinates = (geometry as MultiPoint)
          .getPoint(0)
          .getCoordinates();

        divGeometry.innerHTML += toStringXY(toLonLat(coordinates), 6) + "<br>";
      }
      break;
    }
    case "LineString": {
      const length = Math.round(getLength(geometry as LineString));

      divGeometry.innerHTML += `${length} m.<br>`;
      break;
    }
    case "MultiLineString": {
      const linestrings = (geometry as MultiLineString).getLineStrings();

      divGeometry.innerHTML += `${linestrings.length} line(s)<br>`;

      if (linestrings.length === 1) {
        const length = Math.round(
          getLength((geometry as MultiLineString).getLineString(0))
        );

        divGeometry.innerHTML += `${length} m.<br>`;
      }
      break;
    }
    case "Polygon": {
      const area = Math.round(getArea(geometry as Polygon));

      divGeometry.innerHTML += `${area} m&sup2;<br>`;
      break;
    }
    case "MultiPolygon": {
      const polygons = (geometry as MultiPolygon).getPolygons();

      divGeometry.innerHTML += `${polygons.length} polygon(s)<br>`;

      if (polygons.length === 1) {
        const area = Math.round(
          getArea((geometry as MultiPolygon).getPolygon(0))
        );

        divGeometry.innerHTML += `${area} m&sup2;<br>`;
      }
      break;
    }
  }

  document.getElementById("info-details").append(divGeometry);
}
