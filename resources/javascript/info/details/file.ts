"use strict";

const regex: RegExp = /^(file:\/\/)(\/.+\.[a-zA-Z]+)$/;

export default function (value: any): HTMLAnchorElement | false {
  const match = value.match(regex) !== null;

  if (match !== true) {
    return false;
  }

  const fname = value.substring(value.lastIndexOf("/") + 1);

  const a = document.createElement("a");

  a.href = "#";
  a.className = "text-decoration-none";
  a.innerHTML = `<i class="far fa-file"></i> ${fname}`;

  a.addEventListener("click", (event: Event) => {
    event.preventDefault();

    console.log(value);
  });

  return a;
}
