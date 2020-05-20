"use strict";

const regex: RegExp = /^((https?:\/\/)[-a-zA-Z0-9:@;?&=/%+.*!'(),$_{}^~[\]`#|]+)$/;

export default function (value: any): HTMLAnchorElement | false {
  const match = value.match(regex) !== null;

  if (match !== true) {
    return false;
  }

  const url = new URL(value);

  const a = document.createElement("a");

  a.href = url.toString();
  a.target = "_blank";
  a.className = "text-decoration-none";
  a.innerHTML = `<i class="fas fa-external-link-alt"></i> ${url.host}`;

  return a;
}
