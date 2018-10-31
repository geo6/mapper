import WMTSCapabilities from 'ol/format/WMTSCapabilities';

import generateLayersList from './list';

function parseLayers(layers, searchElements) {
    let results = [];

    for (let i = 0; i < layers.length; i++) {
        /*if (typeof layers[i].Layer !== 'undefined') {
            results = results.concat(parseLayers(layers[i].Layer, searchElements));
        } else*/
        if (typeof searchElements !== 'undefined' && searchElements.indexOf(layers[i].Name) > -1) {
            results.push(layers[i]);
        } else if (typeof searchElements === 'undefined') {
            results.push(layers[i]);
        }
    }

    return results;
}

function GetCapabilities(url) {
    return fetch('/proxy?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0&_url=' + encodeURIComponent(url))
        .then(response => response.text())
        .then((text) => {
            let capabilities = (new WMTSCapabilities()).read(text);

            return {
                capabilities: capabilities,
                layers: parseLayers(capabilities.Contents.Layer)
            };
        });
}

export default function (url) {
    return GetCapabilities(url)
        .then((result) => {
            let crs = [];
            for (let m = 0; m < result.capabilities.Contents.TileMatrixSet.length; m++) {
                crs.push(result.capabilities.Contents.TileMatrixSet[m].SupportedCRS);
            }

            if (crs.indexOf('EPSG:3857') === -1) {
                console.error('The WMTS service "' + url + '" does not support EPSG:3857 ! It supports only ' + crs.join(', ') + '.');

                return null;
            } else {
                let i = window.app.wmts.push({
                    capabilities: result.capabilities,
                    layers: result.layers,
                    olLayer: null,
                    selection: []
                });

                let option = document.createElement('option');

                $(option)
                    .text(result.capabilities.ServiceIdentification.Title)
                    .attr('value', 'wmts:' + (i - 1))
                    .data('target', '#modal-layers-services-wmts-' + (i - 1));

                $('#modal-layers-services-wmts')
                    .append(option)
                    .show();

                let div = document.createElement('div');
                let title = document.createElement('strong');
                let description = document.createElement('p');

                $(title)
                    .text(result.capabilities.ServiceIdentification.Title)
                    .appendTo(div);
                $(description)
                    .addClass('text-info small')
                    .text(result.capabilities.ServiceIdentification.Abstract)
                    .appendTo(div);
                $(div)
                    .append(generateLayersList((i - 1), result.capabilities.Contents.Layer))
                    .attr('id', 'modal-layers-services-wmts-' + (i - 1))
                    .hide();

                $('#modal-layers-layers').append(div);

                return (i - 1);
            }
        });
}
