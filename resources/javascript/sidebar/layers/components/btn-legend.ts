"use strict";

export default function(
  legend: HTMLImageElement | HTMLCanvasElement
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-layer-legend";
  button.title = "Legend";
  button.innerHTML = "<i class=\"far fa-image\"></i>";
  button.disabled = typeof legend === "undefined" || legend === null;

  if (button.disabled === false) {
    button.addEventListener("click", () => {
      const li = button.closest("li.list-group-item") as HTMLDivElement;

      li.querySelector(".layer-legend").toggleAttribute("hidden");
    });
  }

  return button;
}
