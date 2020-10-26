"use strict";

export default function (targets: {
  list: HTMLElement;
  details: HTMLElement;
}): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = "btn btn-outline-secondary btn-sm";
  button.innerHTML = '<i class="fas fa-angle-double-right"></i>';

  const current = parseInt(targets.details.dataset.current);
  const items = targets.list.querySelectorAll("ol > li");
  if (current + 1 >= items.length) {
    button.disabled = true;
  }

  button.addEventListener("click", () => {
    const current = parseInt(targets.details.dataset.current);
    const items = targets.list.querySelectorAll("ol > li");

    if (current + 1 < items.length) {
      items[current + 1].dispatchEvent(new MouseEvent("click"));
    }
  });

  return button;
}
