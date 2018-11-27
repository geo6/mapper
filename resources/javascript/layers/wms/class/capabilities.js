import WMSCapabilities from 'ol/format/WMSCapabilities';

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

export default function (url) {
    return fetch(`${window.app.baseUrl}proxy?SERVICE=WMS&REQUEST=GetCapabilities&_url=${encodeURIComponent(url)}`)
        .then(response => response.text())
        .then(response => {
            let capabilities = (new WMSCapabilities()).read(response);

            if (typeof capabilities.Capability.Layer.CRS !== 'undefined' && capabilities.Capability.Layer.CRS.indexOf('EPSG:3857') === -1) {
                const crs = capabilities.Capability.Layer.CRS.join(', ');

                throw new Error(`The WMS service "${url}" does not support EPSG:3857 ! It supports only ${crs}.`);
            }

            return {
                capabilities: capabilities,
                layers: typeof capabilities.Capability.Layer.Layer !== 'undefined' ? parseLayers(capabilities.Capability.Layer.Layer) : parseLayers(capabilities.Capability.Layer)
            };
        });
}
