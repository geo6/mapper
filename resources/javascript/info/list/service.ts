"use strict";

/**
 * Create ul DOM element for a specific service (WMS/WMTS) in the sidebar.
 *
 * @param {string} serviceType Service type (wms|wmts).
 * @param {int} serviceIndex   Service index (in array of its own type).
 * @param {string} title       Service title.
 *
 * @returns {object} ul DOM element.
 */
export function createUlService(
  serviceType: "wms" | "wmts",
  serviceIndex: number,
  title: string
): HTMLUListElement {
  const element = document.getElementById(
    `info-service-${serviceType}-${serviceIndex}`
  ) as HTMLUListElement;

  if (element !== null) {
    return element;
  }

  const ul = document.createElement("ul");

  const titleFormatted = title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1");

  const li = document.createElement("li");
  li.id = `info-service-${serviceType}-${serviceIndex}`;
  li.innerHTML =
    `<strong>${titleFormatted}</strong>` +
    '<div class="loading text-muted"><i class="fas fa-spinner fa-spin"></i> Loading ...</div>';

  li.append(ul);

  document.getElementById("info-list").append(li);

  return ul;
}

/**
 * Create ol DOM element for a specific layer in the sidebar.
 *
 * @param {string} serviceType Service type (wms|wmts).
 * @param {int} serviceIndex   Service index (in array of its own type).
 * @param {int} layerIndex     Layer index (in loaded layers of the service).
 * @param {string} title       Layer title.
 *
 * @returns {object} ol DOM element.
 */
export function createOlLayer(
  serviceType: "wms" | "wmts",
  serviceIndex: number,
  layerIndex: number,
  title: string
): HTMLOListElement {
  const element = document.getElementById(
    `info-layer-${serviceType}-${serviceIndex}-${layerIndex}`
  ) as HTMLOListElement;

  if (element !== null) {
    return element;
  }

  const ol = document.createElement("ol");

  const titleFormatted = title.replace(/(\r\n|\n\r|\r|\n)/g, "<br>" + "$1");

  const li = document.createElement("li");
  li.id = `info-layer-${serviceType}-${serviceIndex}-${layerIndex}`;
  li.innerHTML = `<strong>${titleFormatted}</strong>`;
  li.append(ol);

  document
    .querySelector(`#info-service-${serviceType}-${serviceIndex} > ul`)
    .append(li);

  return ol;
}
