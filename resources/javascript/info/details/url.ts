"use strict";

const regex = /^((https?:\/\/)[-a-zA-Z0-9:@;?&=/%+.*!'(),$_{}^~[\]`#|]+)$/;

export function check(value: any): boolean {
  return value.toString().match(regex) !== null;
}

export function display(value: any): HTMLAnchorElement {
  const url = new URL(value);

  const a = document.createElement("a");

  a.href = url.toString();
  a.target = "_blank";
  a.className = "text-decoration-none";
  a.innerHTML = `<i class="fas fa-external-link-alt"></i> Open`;
  a.title = url.host;

  return a;
}
