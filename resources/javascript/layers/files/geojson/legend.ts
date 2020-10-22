"use strict";

import { asArray as colorAsArray } from "ol/color";

export default function (
  legend: Array<{
    color: string;
    size?: number;
    symbol?: string;
    text: string;
    type?: string;
    value: string | number | null;
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
    const type = legend[i].type || "point";
    const symbol = legend[i].symbol || "circle";

    switch (type.toLowerCase()) {
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
      default: {
        switch (symbol.toLowerCase()) {
          case "circle-stroked":
            canvasContext.beginPath();
            canvasContext.arc(15, oy + 5, 5, 0, 360);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = legend[i].color;
            canvasContext.stroke();
            break;
          case "cross":
            canvasContext.beginPath();
            canvasContext.moveTo(10, oy);
            canvasContext.lineTo(20, oy + 10);
            canvasContext.moveTo(10, oy + 10);
            canvasContext.lineTo(20, oy);
            canvasContext.strokeStyle = legend[i].color;
            canvasContext.stroke();
            break;
          case "square":
            canvasContext.fillStyle = legend[i].color;
            canvasContext.fillRect(10, oy, 10, 10);
            break;
          case "square-stroked":
            canvasContext.beginPath();
            canvasContext.moveTo(10, oy);
            canvasContext.lineTo(20, oy);
            canvasContext.lineTo(20, oy + 10);
            canvasContext.lineTo(10, oy + 10);
            canvasContext.lineTo(10, oy);
            canvasContext.strokeStyle = legend[i].color;
            canvasContext.stroke();
            break;
          case "star":
            canvasContext.beginPath();
            canvasContext.moveTo(15, oy);
            canvasContext.lineTo(12, oy + 10);
            canvasContext.lineTo(20, oy + 3);
            canvasContext.lineTo(10, oy + 3);
            canvasContext.lineTo(18, oy + 10);
            canvasContext.lineTo(15, oy);
            canvasContext.fillStyle = legend[i].color;
            canvasContext.fill();
            break;
          case "star-stroked":
            canvasContext.beginPath();
            canvasContext.moveTo(15, oy);
            canvasContext.lineTo(12, oy + 10);
            canvasContext.lineTo(20, oy + 3);
            canvasContext.lineTo(10, oy + 3);
            canvasContext.lineTo(18, oy + 10);
            canvasContext.lineTo(15, oy);
            canvasContext.strokeStyle = legend[i].color;
            canvasContext.stroke();
            break;
          case "triangle":
            canvasContext.beginPath();
            canvasContext.moveTo(10, oy + 10);
            canvasContext.lineTo(15, oy);
            canvasContext.lineTo(20, oy + 10);
            canvasContext.lineTo(10, oy + 10);
            canvasContext.fillStyle = legend[i].color;
            canvasContext.fill();
            break;
          case "triangle-stroked":
            canvasContext.beginPath();
            canvasContext.moveTo(10, oy + 10);
            canvasContext.lineTo(15, oy);
            canvasContext.lineTo(20, oy + 10);
            canvasContext.lineTo(10, oy + 10);
            canvasContext.strokeStyle = legend[i].color;
            canvasContext.stroke();
            break;
          case "circle":
          default:
            canvasContext.beginPath();
            canvasContext.arc(15, oy + 5, 5, 0, 360);
            canvasContext.fillStyle = legend[i].color;
            canvasContext.fill();
            break;
        }
        break;
      }
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
