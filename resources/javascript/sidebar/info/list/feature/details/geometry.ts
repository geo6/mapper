"use strict";

import { toStringXY } from "ol/coordinate";
import {
  Geometry,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "ol/geom";
import { toLonLat } from "ol/proj";
import { getArea, getLength } from "ol/sphere";

export default function (geometry: Geometry): HTMLDivElement {
  const div = document.createElement("div");

  div.className = "text-info";

  const type = geometry.getType();

  switch (type) {
    case "Point": {
      const coordinates = (geometry as Point).getCoordinates();

      div.innerHTML += type + "<br>" + toStringXY(toLonLat(coordinates), 6) + "<br>";
      break;
    }
    case "MultiPoint": {
      const points = (geometry as MultiPoint).getPoints();

      div.innerHTML += `${type} : ${points.length} point(s)<br>`;

      if (points.length === 1) {
        const coordinates = (geometry as MultiPoint)
          .getPoint(0)
          .getCoordinates();

        div.innerHTML += toStringXY(toLonLat(coordinates), 6) + "<br>";
      }
      break;
    }
    case "LineString": {
      const length = Math.round(getLength(geometry as LineString));

      div.innerHTML += type + "<br>" + `${length} m.<br>`;
      break;
    }
    case "MultiLineString": {
      const linestrings = (geometry as MultiLineString).getLineStrings();

      div.innerHTML += `${type} : ${linestrings.length} line(s)<br>`;

      if (linestrings.length === 1) {
        const length = Math.round(
          getLength((geometry as MultiLineString).getLineString(0))
        );

        div.innerHTML += `${length} m.<br>`;
      }
      break;
    }
    case "Polygon": {
      const area = Math.round(getArea(geometry as Polygon));

      div.innerHTML += type + "<br>" + `${area} m&sup2;<br>`;
      break;
    }
    case "MultiPolygon": {
      const polygons = (geometry as MultiPolygon).getPolygons();

      div.innerHTML += `${type} : ${polygons.length} polygon(s)<br>`;

      if (polygons.length === 1) {
        const area = Math.round(
          getArea((geometry as MultiPolygon).getPolygon(0))
        );

        div.innerHTML += `${area} m&sup2;<br>`;
      }
      break;
    }
  }

  return div;
}