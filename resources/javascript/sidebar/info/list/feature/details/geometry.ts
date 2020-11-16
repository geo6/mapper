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

      div.innerHTML +=
        type + "<br>" + toStringXY(toLonLat(coordinates), 6) + "<br>";
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

      const length = Math.round(getLength(geometry as MultiLineString));

      div.innerHTML +=
        length < 1000
          ? `${length} m.<br>`
          : `${(length / 1000).toFixed(2)} km.<br>`;
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

      const area = Math.round(getArea(geometry as MultiPolygon));

      div.innerHTML +=
        area < 1000000
          ? `${area} m&sup2;<br>`
          : `${(area / 1000000).toFixed(2)} km&sup2;<br>`;
      break;
    }
  }

  return div;
}
