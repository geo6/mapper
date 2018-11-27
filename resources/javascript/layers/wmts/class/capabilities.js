import WMTSCapabilities from 'ol/format/WMTSCapabilities';

function parseLayers (layers, searchElements) {
    let results = [];

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

export default function (url) {
    return fetch(`${window.app.baseUrl}proxy?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0&_url=${encodeURIComponent(url)}`)
        .then(response => response.text())
        .then(response => {
            let capabilities = (new WMTSCapabilities()).read(response);

            let crs = [];
            for (let m = 0; m < capabilities.Contents.TileMatrixSet.length; m++) {
                const supportedCRS = capabilities.Contents.TileMatrixSet[m].SupportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3');

                crs.push(supportedCRS);
            }

            if (crs.indexOf('EPSG:3857') === -1) {
                throw new Error(`The WMTS service "${url}" does not support EPSG:3857 ! It supports only ${crs.join(', ')}.`);
            }

            return {
                capabilities: capabilities,
                layers: parseLayers(capabilities.Contents.Layer)
            };
        });
}
