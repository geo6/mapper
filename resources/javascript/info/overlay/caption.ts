"use strict";

export default function (text: string, html = false): void {
  const div = document.createElement("div");

  div.className = "overlay-caption";

  if (html === true) {
    div.innerHTML = text;
  } else {
    div.innerText = text;
  }

  document.querySelector(".overlay-content").append(div);
}
