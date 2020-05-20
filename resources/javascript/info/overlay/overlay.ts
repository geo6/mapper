"use strict";

import { create as createBackground } from "./background";
import createLoading from "./loading";
import createContent from "./content";
import createImage from "./image";
import createCaption from "./caption";

/**
 * This group of "overlay" functions is based on the Image Overlay plugin for FilePond
 *
 * @see https://nielsboogaard.github.io/filepond-plugin-image-overlay/
 */
export default function (event: Event, captionCallback: Function): void {
  event.preventDefault();

  const element = event.currentTarget as HTMLElement;
  const href = element.getAttribute("href");

  document.querySelector("body").style.overflow = "hidden";

  createBackground();
  createLoading();
  createContent();

  const image = new Image();
  image.src = href;
  image.onload = () => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    document.querySelector(".overlay-loading").remove();

    createImage(image, width, height);

    if (typeof captionCallback !== "undefined") {
      const caption = captionCallback(element);

      createCaption(caption, true);
    }
  };
}
