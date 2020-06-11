"use strict";

export default function (
  type: string,
  index: number,
  layer: string
): HTMLAnchorElement[] {
  const aOrderUp = document.createElement("a");
  aOrderUp.href = "#";
  aOrderUp.innerHTML = '<i class="fas fa-caret-up"></i>';
  aOrderUp.addEventListener("click", (event: Event) => {
    event.preventDefault();
    if (index > 0) {
      console.info("UP", type, index, layer);
    }
  });

  if (index === 0) {
    aOrderUp.className = "text-light";
  }

  const aOrderDown = document.createElement("a");
  aOrderDown.href = "#";
  aOrderDown.innerHTML = '<i class="fas fa-caret-down"></i>';
  aOrderDown.addEventListener("click", (event: Event) => {
    event.preventDefault();
    console.info("DOWN", type, index, layer);
  });

  return [aOrderUp, aOrderDown];
}
