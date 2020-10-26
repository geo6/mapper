"use strict";

export default function (targets: { list: HTMLElement; details: HTMLElement; }): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-sm";
  button.innerHTML = '<i class="fas fa-angle-double-up"></i> List';

  button.addEventListener("click", () => {
    targets.details.hidden = true;
    targets.list.hidden = false;
  });

  return button;
}