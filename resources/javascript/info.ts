"use strict";

export default function () {
  document
    .getElementById("infos-list-btn-back")
    .addEventListener("click", () => {
      $("#info-details").hide();
      $("#info-list").show();
    });

  document
    .getElementById("infos-list-btn-prev")
    .addEventListener("click", () => {
      const current = parseInt(
        document.getElementById("info-details").dataset.current
      );

      if (current - 1 >= 0) {
        $(`#info-list ol > li:eq(${current - 1})`).trigger("click");
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
        $(`#info-list ol > li:eq(${current + 1})`).trigger("click");
      }
    });
}
