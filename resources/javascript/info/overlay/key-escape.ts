"use strict";

import { destroy } from "./background";

export default function (): void {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.code === "Escape") {
      destroy();

      document.querySelector("body").style.overflow = "";
    }
  });
}
