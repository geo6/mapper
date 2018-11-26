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

export {
    default as displayWMSFeatureInfoList
} from './service/wms';
export {
    default as displayWMTSFeatureInfoList
} from './service/wmts';
