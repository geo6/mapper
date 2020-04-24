"use strict";

import { asArray as colorAsArray } from "ol/color";
import GeoJSONFormat from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

import File from "../../file";
import ExtendedFeatureCollection from "../../ExtendedFeatureCollection";

import { map } from "../../main";

export function add(file: File): VectorSource {
  return new VectorSource({
    features: new GeoJSONFormat().readFeatures(file.content, {
      featureProjection: map.getView().getProjection(),
    }),
  });
}

export function applyStyle(
  content: ExtendedFeatureCollection
): ExtendedFeatureCollection {
  const column = content.legendColumn;
  const styles = {};
  content.legend.forEach((l) => {
    const style = { color: l.color };

    if (typeof l.size !== "undefined" && l.size !== null) {
      Object.assign(style, { "marker-size": l.size });
    }
    if (typeof l.symbol !== "undefined" && l.symbol !== null) {
      Object.assign(style, { "marker-symbol": l.symbol });
    }

    styles[l.value.toString()] = style;
  });

  content.features.map((feature: GeoJSON.Feature) => {
    const value = feature.properties[column] || null;

    if (Object.keys(styles).indexOf(value) > -1) {
      Object.assign(feature.properties, styles[value]);
    }

    return feature;
  });

  return content;
}

export function legend(
  legend: Array<{
    type: string;
    text: string;
    color: string;
    value?: any;
  }>
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  canvas.width = 200;
  canvas.height = 30 + (legend.length - 1) * 20;

  const canvasContext = canvas.getContext("2d");

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < legend.length; i++) {
    const oy = i * 20 + 10;

    const color = colorAsArray(legend[i].color).slice();
    const type =
      typeof legend[i].type !== "undefined"
        ? legend[i].type.toLowerCase()
        : "point";

    switch (type) {
      case "line":
        canvasContext.beginPath();
        canvasContext.moveTo(10, oy + 10);
        canvasContext.lineTo(10, oy);
        canvasContext.lineTo(15, oy);
        canvasContext.lineTo(15, oy + 10);
        canvasContext.lineTo(20, oy + 10);
        canvasContext.lineTo(20, oy);
        canvasContext.strokeStyle = legend[i].color;
        canvasContext.stroke();
        break;
      case "polygon":
        canvasContext.fillStyle =
          "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.2)";
        canvasContext.fillRect(10, oy, 10, 10);
        canvasContext.strokeStyle = legend[i].color;
        canvasContext.strokeRect(10, oy, 10, 10);
        break;
      case "point":
      default:
        canvasContext.beginPath();
        canvasContext.arc(15, oy + 5, 5, 0, 360);
        canvasContext.fillStyle = legend[i].color;
        canvasContext.fill();
        break;
    }

    canvasContext.font = "12px sans-serif";
    canvasContext.fillStyle = "#000000";
    canvasContext.fillText(
      legend[i].text.length > 28
        ? legend[i].text.substring(0, 25) + "..."
        : legend[i].text,
      30,
      oy + 9,
      170
    );
  }

  return canvas;
}
