"use strict";

export default function (): void {
  const div = document.createElement("div");

  div.className = "overlay-loading";
  div.innerText = "Loading...";

  document.querySelector(".overlay").append(div);
}
