import displayFeatureInList from '../feature';

function createUlService (serviceType, serviceIndex, title) {
    if ($(`#info-service-${serviceType}-${serviceIndex}`).length === 0) {
        let ul = document.createElement('ul');

        $(document.createElement('li'))
            .attr('id', `info-service-${serviceType}-${serviceIndex}`)
            .append(`<strong>${title}</strong>`)
            .append(ul)
            .appendTo('#info-list');

        return ul;
    }

    return $(`#info-service-${serviceType}-${serviceIndex} > ul`);
}

function createOlLayer (serviceType, serviceIndex, layerIndex, title) {
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

export default function (service, layerName, feature, featureIndex) {
    let serviceIndex = null;
    let serviceType = null;

    if (window.app.wms.indexOf(service) > -1) {
        serviceIndex = window.app.wms.indexOf(service);
        serviceType = 'wms';
    } else if (window.app.wmts.indexOf(service) > -1) {
        serviceIndex = window.app.wmts.indexOf(service);
        serviceType = 'wmts';
    } else {
        // To Do : error because service was not found
    }

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);

    const serviceTitle = service.capabilities.Service.Title;
    const layerTitle = service.layers[layerIndex].Title;

    createUlService(serviceType, serviceIndex, serviceTitle);
    const olLayer = createOlLayer(serviceType, serviceIndex, layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    displayFeatureInList(feature, featureIndex, title, olLayer, service.selection);
}
