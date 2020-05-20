"use strict";

export function create(): void {
  document.body.style.overflow = "hidden";

  const div = document.createElement("div");

  div.className = "overlay";

  div.addEventListener("click", () => {
    destroy();

    document.querySelector("body").style.overflow = "";
  });

  document.body.append(div);
}

export function destroy(): void {
  const element = document.querySelector(".overlay");

  if (element !== null) {
    element.remove();
  }
}
