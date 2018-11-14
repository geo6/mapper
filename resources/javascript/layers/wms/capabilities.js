import WMSCapabilities from 'ol/format/WMSCapabilities';

import generateLayersList from './list';

function parseLayers (layers, searchElements) {
    let results = [];

    if (Array.isArray(layers)) {
        for (let i = 0; i < layers.length; i++) {
            if (typeof layers[i].Layer !== 'undefined') {
                results = results.concat(parseLayers(layers[i].Layer, searchElements));
            } else if (typeof searchElements !== 'undefined' && searchElements.indexOf(layers[i].Name) > -1) {
                results.push(layers[i]);
            } else if (typeof searchElements === 'undefined') {
                results.push(layers[i]);
            }
        }
    } else {
        results.push(layers);
    }

    return results;
}

function GetCapabilities (url) {
    return fetch(`${window.app.baseUrl}proxy?SERVICE=WMS&REQUEST=GetCapabilities&_url=${encodeURIComponent(url)}`)
        .then(response => response.text())
        .then((text) => {
            let capabilities = (new WMSCapabilities()).read(text);

            return {
                capabilities: capabilities,
                layers: typeof capabilities.Capability.Layer.Layer !== 'undefined' ? parseLayers(capabilities.Capability.Layer.Layer) : parseLayers(capabilities.Capability.Layer)
            };
        });
}

export default function (url) {
    return GetCapabilities(url)
        .then((result) => {
            if (typeof result.capabilities.Capability.Layer.CRS !== 'undefined' && result.capabilities.Capability.Layer.CRS.indexOf('EPSG:3857') === -1) {
                console.error('The WMS service "' + url + '" does not support EPSG:3857 ! It supports only ' + result.capabilities.Capability.Layer.CRS.join(', ') + '.');

                return null;
            } else {
                let i = window.app.wms.push({
                    capabilities: result.capabilities,
                    layers: result.layers,
                    olLayer: null,
                    selection: []
                });

                let option = document.createElement('option');

                $(option)
                    .text(result.capabilities.Service.Title)
                    .attr('value', 'wms:' + (i - 1))
                    .data('target', '#modal-layers-services-wms-' + (i - 1));

                $('#modal-layers-services-wms').append(option).show();

                let div = document.createElement('div');
                let title = document.createElement('strong');
                let description = document.createElement('p');

                $(title)
                    .text(result.capabilities.Service.Title)
                    .appendTo(div);
                $(description)
                    .addClass('text-info small')
                    .text(result.capabilities.Service.Abstract)
                    .appendTo(div);
                $(div)
                    .append(generateLayersList((i - 1), result.layers))
                    .attr('id', 'modal-layers-services-wms-' + (i - 1))
                    .hide();

                $('#modal-layers-layers').append(div);

                return (i - 1);
            }
        });
}
