"use strict";

import slugify from "slugify";

type Collection = string[] | string;

function slugCollection(collection: Collection): string {
  return Array.isArray(collection)
    ? slugify(collection.join("-"))
    : slugify(collection);
}

function createHeader(type: string, collection: Collection): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "accordion-header";

  const button = document.createElement("button");
  button.className = "accordion-button collapsed";
  button.innerText = Array.isArray(collection)
    ? collection.join(" / ")
    : collection;
  button.dataset.bsToggle = "collapse";
  button.dataset.bsTarget = `#${type}-${slugCollection(collection)}-list`;

  div.append(button);

  return div;
}

function createBody(type: string, collection: Collection): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "accordion-collapse collapse collapsed";
  div.id = `${type}-${slugCollection(collection)}-list`;
  div.dataset.parent = `#modal-layers-files-${type}`;

  const ul = document.createElement("ul");
  ul.className = "list-group list-group-flush";

  div.append(ul);

  div.addEventListener("shown.bs.collapse", (event) => {
    event.target.parentElement.querySelector(".accordion-header").scrollIntoView();
  });

  return div;
}

export default function (type: string, collection: Collection): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "accordion-item";
  div.dataset.collection = slugCollection(collection);

  const body = createBody(type, collection);
  const header = createHeader(type, collection);

  div.append(header, body);

  return div;
}
