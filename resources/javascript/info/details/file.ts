"use strict";

import Overlay from "@geo6/overlay-image-preview";

import { baseUrl, customKey } from "../../main";

const regex = /^(file:\/\/)(\/.+\.[a-zA-Z]+)$/;

export function check(value: any): boolean {
  return value.toString().match(regex) !== null;
}

export async function display(value: any): Promise<HTMLAnchorElement | string> {
  const urlInfo =
    `${baseUrl}preview/info?` +
    new URLSearchParams({
      c: customKey !== null ? customKey : "",
      path: value,
    }).toString();

  const response = await fetch(urlInfo);

  if (response.ok !== true) {
    return value;
  }

  const json = (await response.json()) as {
    path: string;
    filename: string;
    mime: string;
    exif?: any;
  };

  const urlPreview =
    `${baseUrl}preview/file?` +
    new URLSearchParams({
      c: customKey !== null ? customKey : "",
      path: json.path,
    }).toString();

  const a = document.createElement("a");

  a.className = "text-decoration-none";
  a.href = urlPreview;

  if (json.mime.match(/^image\/.+$/) !== null) {
    a.dataset.toggle = "overlay";
    a.dataset.filename = json.filename;

    if (typeof json.exif !== "undefined" && json.exif !== null) {
      if (typeof json.exif.IFD0.Make !== "undefined") {
        a.dataset.exifMake = json.exif.IFD0.Make;
      }
      if (typeof json.exif.IFD0.Model !== "undefined") {
        a.dataset.exifModel = json.exif.IFD0.Model;
      }
      if (typeof json.exif.EXIF.DateTimeOriginal !== "undefined") {
        a.dataset.exifDatetime = json.exif.EXIF.DateTimeOriginal;
      }
    }

    a.title = json.filename;
    a.innerHTML = '<i class="fas fa-file-image"></i> Preview';

    a.addEventListener("click", (event: Event) => {
      event.preventDefault();

      const overlay = new Overlay(
        event.currentTarget as HTMLElement,
        (element: HTMLElement) => {
          const make = element.dataset.exifMake;
          const model = element.dataset.exifModel;
          const datetime = element.dataset.exifDatetime;
          const filename = element.dataset.filename;

          let caption = "";
          if (typeof make !== "undefined" || typeof model !== "undefined") {
            caption += `<div>${make} - ${model}</div>`;
          }
          if (typeof datetime !== "undefined") {
            caption += `<div>${datetime}</div>`;
          }
          caption += `<div><samp>${filename}</samp></div>`;

          return caption;
        }
      );
      overlay.open();
    });
  } else {
    a.target = "_blank";
    a.title = json.filename;
    a.innerHTML = '<i class="fas fa-file"></i> Open';
  }

  return a;
}
