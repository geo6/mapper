"use strict";

export default function (): void {
  document
    .getElementById("infos-list-btn-back")
    .addEventListener("click", () => {
      document.getElementById("info-location").hidden = false;
      document.getElementById("info-list").hidden = false;
      document.getElementById("info-details").hidden = true;
    });

  document
    .getElementById("infos-list-btn-prev")
    .addEventListener("click", () => {
      const current = parseInt(
        document.getElementById("info-details").dataset.current
      );

      if (current - 1 >= 0) {
        document
          .querySelectorAll("#info-list ol > li")
          [current - 1].dispatchEvent(new MouseEvent("click"));
        // $(`#info-list ol > li:eq(${current - 1})`).trigger("click");
      }
    });

  document
    .getElementById("infos-list-btn-next")
    .addEventListener("click", () => {
      const current = parseInt(
        document.getElementById("info-details").dataset.current
      );
      const items = document.querySelectorAll("#info-list ol > li");

      if (current + 1 < items.length) {
        document
          .querySelectorAll("#info-list ol > li")
          [current + 1].dispatchEvent(new MouseEvent("click"));

        // $(`#info-list ol > li:eq(${current + 1})`).trigger("click");
      }
    });
}
