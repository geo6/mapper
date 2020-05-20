"use strict";

import { destroy } from "./background";

function determineImageOverlaySize(
  width: number,
  height: number,
  element: HTMLElement
): void {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  if (width > w || height > h) {
    element.style.backgroundSize = "contain";
  }
}

export default function (
  image: HTMLImageElement,
  width: number,
  height: number
): void {
  const div = document.createElement("div");

  div.className = "overlay-image";
  div.style.backgroundImage = `url(${image.src})`;

  div.addEventListener("click", () => {
    destroy();

    document.querySelector("body").style.overflow = "";
  });

  determineImageOverlaySize(width, height, div);

  document.querySelector(".overlay-content").append(div);
}
