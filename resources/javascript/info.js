import {
    toLonLat
} from 'ol/proj';
import {
    toStringXY
} from 'ol/coordinate';

function createUlService(serviceType, serviceId, title) {
    if ($(`#info-service-${serviceType}-${serviceId}`).length === 0) {
        let ul = document.createElement('ul');

        $(document.createElement('li'))
            .attr('id', `info-service-${serviceType}-${serviceId}`)
            .append(`<strong>${title}</strong>`)
            .append(ul)
            .appendTo('#info-list');

        return ul;
    }

    return $(`#info-service-${serviceType}-${serviceId} > ul`);
}

function createOlLayer(serviceType, serviceId, layerId, title) {
    if ($(`#info-layer-${serviceType}-${serviceId}-${layerId}`).length === 0) {
        let ol = document.createElement('ol');

        $(document.createElement('li'))
            .attr('id', `info-layer-${serviceType}-${serviceId}-${layerId}`)
            .append(`<strong>${title}</strong>`)
            .append(ol)
            .appendTo(`#info-service-${serviceType}-${serviceId} > ul`);

        return ol;
    }

    return $(`#info-layer-${serviceType}-${serviceId}-${layerId} > ol`);
}

export function displayLocationInfo(coordinates) {
    $('#info-location-coordinates').text(toStringXY(toLonLat(coordinates), 6));

    $('.sidebar-tabs > ul > li:has(a[href="#info"])').removeClass('disabled');
    window.app.sidebar.open('info');
}

export function displayFeatureInfo(service, layerName, feature, index) {
    let serviceId = null;
    let serviceType = null;

    if (window.app.wms.indexOf(service) > -1) {
        serviceId = window.app.wms.indexOf(service);
        serviceType = 'wms';
    } else if (window.app.wmts.indexOf(service) > -1) {
        serviceId = window.app.wmts.indexOf(service);
        serviceType = 'wmts';
    } else {
        // To Do : error because service was not found
    }

    let layerId = service.layers.findIndex(element => element.Name === layerName);

    let ulService = createUlService(serviceType, serviceId, service.capabilities.Service.Title);
    let olLayer = createOlLayer(serviceType, serviceId, layerId, service.layers[layerId].Title);

    let id = feature.getId();
    let properties = feature.getProperties();
    let geometryName = feature.getGeometryName();
    let geometry = feature.getGeometry();

    delete properties[geometryName];

    let label = typeof geometry !== 'undefined' ? '<i class="fas fa-vector-square"></i> ' : '';

    if (typeof id !== 'undefined') {
        label += id;
    } else {
        for (const prop in properties) {
            if (typeof properties[prop] === 'number' || typeof properties[prop] === 'string') {
                label += `<em>${prop}</em>: ${properties[prop]}`;

                break;
            }
        }
    }

    let li = document.createElement('li');

    $(li)
        .append(label)
        .appendTo(olLayer)
        .data('index', index)
        .on('click', event => {
            let li = event.currentTarget;
            let { index } = $(li).data();
            let feature = service.selection[index];

            window.app.marker.setGeometry(feature.getGeometry());
            window.app.markerLayer.setVisible(true);
        })
        // .data('geometry', JSON.stringify(geometry))
        // .hover(event => {
        //     let li = event.target;
        //     let {
        //         geometry
        //     } = $(li).data();

        //     console.log(geometry);

        //     if (typeof geometry !== 'undefined') {
        //         window.app.marker.setGeometry(geometry);
        //         window.app.markerLayer.setVisible(true);
        //     }
        // }, event => {
        //     window.app.markerLayer.setVisible(false);
        // });
}
