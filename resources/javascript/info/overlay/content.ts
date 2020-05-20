"use strict";

export default function (): void {
  const div = document.createElement("div");

  div.className = "overlay-content";

  document.querySelector(".overlay").append(div);
}
