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
  div.className = "card-header";

  const button = document.createElement("button");
  button.className = "btn btn-link btn-block text-left p-0";
  button.innerText = Array.isArray(collection)
    ? collection.join(" / ")
    : collection;
  button.dataset.toggle = "collapse";
  button.dataset.target = `#${type}-${slugCollection(collection)}-list`;

  div.append(button);

  return div;
}

function createBody(type: string, collection: Collection): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "collapse";
  div.id = `${type}-${slugCollection(collection)}-list`;
  div.dataset.parent = `#modal-layers-files-${type}`;

  const ul = document.createElement("ul");
  ul.className = "list-group list-group-flush";

  div.append(ul);

  div.addEventListener("shown.bs.collapse", (event) => {
    event.target.parentElement.querySelector(".card-header").scrollIntoView();
  });

  return div;
}

export default function (type: string, collection: Collection): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.collection = slugCollection(collection);

  const body = createBody(type, collection);
  const header = createHeader(type, collection);

  div.append(header, body);

  return div;
}
