/**
 * Create ul DOM element for a specific service (WMS/WMTS) in the sidebar.
 *
 * @param {string} serviceType Service type (wms|wmts).
 * @param {int} serviceIndex   Service index (in array of its own type).
 * @param {string} title       Service title.
 *
 * @returns {object} ul DOM element.
 */
export function createUlService (serviceType, serviceIndex, title) {
    if ($(`#info-service-${serviceType}-${serviceIndex}`).length === 0) {
        let ul = document.createElement('ul');

        $(document.createElement('li'))
            .attr('id', `info-service-${serviceType}-${serviceIndex}`)
            .append(`<strong>${title}</strong>`)
            .append('<div class="loading text-muted"><i class="fas fa-spinner fa-spin"></i> Loading ...</div>')
            .append(ul)
            .appendTo('#info-list');

        return ul;
    }

    return $(`#info-service-${serviceType}-${serviceIndex} > ul`);
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
export function createOlLayer (serviceType, serviceIndex, layerIndex, title) {
    if ($(`#info-layer-${serviceType}-${serviceIndex}-${layerIndex}`).length === 0) {
        let ol = document.createElement('ol');

        $(document.createElement('li'))
            .attr('id', `info-layer-${serviceType}-${serviceIndex}-${layerIndex}`)
            .append(`<strong>${title}</strong>`)
            .append(ol)
            .appendTo(`#info-service-${serviceType}-${serviceIndex} > ul`);

        return ol;
    }

    return $(`#info-layer-${serviceType}-${serviceIndex}-${layerIndex} > ol`);
}
