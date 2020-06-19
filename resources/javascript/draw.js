"use strict";

import DrawControl from "./map/DrawControl";

export let drawControl;

export default function () {
  drawControl = new DrawControl();

  document.querySelectorAll("#sidebar a").forEach((element) => {
    element.addEventListener("click", () => {
      const li = Array.from(
        document.querySelectorAll("#sidebar > .sidebar-tabs > ul > li")
      ).find((element) => element.querySelector('a[href="#draw"]') !== null);

      drawControl.active = li.classList.contains("active");

      if (drawControl.active === false) {
        drawControl.disable();
        drawControl.type = null;
      }
    });
  });

  document.getElementById("btn-draw-clear").addEventListener("click", () => {
    drawControl.clear();
  });

  document.getElementById("btn-draw-export").addEventListener("click", () => {
    drawControl.export();
  });

  document
    .getElementById("btn-draw-properties")
    .addEventListener("reset", () => {
      drawControl.resetForm();
    });

  document
    .getElementById("btn-draw-properties")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      drawControl.submitForm();
    });

  document
    .querySelectorAll("#draw button.list-group-item-action")
    .forEach((element) => {
      element.addEventListener("click", (event) => {
        const { type } = event.currentTarget.dataset;
        const active = event.currentTarget.classList.contains("active");

        if (active === true) {
          drawControl.disable();
          drawControl.type = null;
        } else {
          if (drawControl.type !== null) {
            drawControl.disable();
            drawControl.type = null;
          }

          drawControl.type = type;
          drawControl.enable();
        }
      });
    });
}
