'use strict';

import WMTSCapabilities from 'ol/format/WMTSCapabilities';

import { customKey, map } from '../../../main';

function parseLayers (layers, searchElements) {
    const results = [];

    for (let i = 0; i < layers.length; i++) {
        /* if (typeof layers[i].Layer !== 'undefined') {
            results = results.concat(parseLayers(layers[i].Layer, searchElements));
        } else */
        if (typeof searchElements !== 'undefined' && searchElements.indexOf(layers[i].Name) > -1) {
            results.push(layers[i]);
        } else if (typeof searchElements === 'undefined') {
            results.push(layers[i]);
        }
    }

    return results;
}

export default function (origUrl) {
    const url = `${window.app.baseUrl}proxy` + '?' + $.param({
        c: customKey,
        SERVICE: 'WMTS',
        REQUEST: 'GetCapabilities',
        VERSION: '1.0.0',
        _url: origUrl
    });
    return fetch(url)
        .then(response => response.text())
        .then(response => {
            const capabilities = (new WMTSCapabilities()).read(response);

            const crs = [];
            for (let m = 0; m < capabilities.Contents.TileMatrixSet.length; m++) {
                const supportedCRS = capabilities.Contents.TileMatrixSet[m].SupportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');

                crs.push(supportedCRS);
            }

            const projection = map.getView().getProjection().getCode();
            if (crs.indexOf(projection) === -1) {
                throw new Error(`The WMTS service "${origUrl}" does not support ${projection} ! It supports only ${crs.join(', ')}.`);
            }

            return {
                capabilities: capabilities,
                layers: parseLayers(capabilities.Contents.Layer),
                mixedContent: window.app.https === true && RegExp('^http://').test(origUrl)
            };
        });
}
