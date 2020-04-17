'use strict';

/**
 * See https://github.com/openlayers/openlayers/issues/2368
 * See https://github.com/openlayers/openlayers/pull/2373
 * See https://github.com/openlayers/openlayers/pull/3150
 */

import GeoJSON from 'ol/format/GeoJSON';

function WMTSGetFeatureInfoUrl (template, coordinate, source, resolution) {
    const tilegrid = source.getTileGrid();
    const tileResolutions = tilegrid.getResolutions();

    let zoomIndex = Infinity;
    let diff = Infinity;

    for (let i = 0; i < tileResolutions.length; i++) {
        const tileResolution = tileResolutions[i];

        const diffP = Math.abs(resolution - tileResolution);

        if (diffP < diff) {
            diff = diffP;
            zoomIndex = i;
        }

        if (tileResolution < resolution) break;
    }

    const tileSize = tilegrid.getTileSize(zoomIndex);
    const tileOrigin = tilegrid.getOrigin(zoomIndex);

    const fx = (coordinate[0] - tileOrigin[0]) / (resolution * tileSize);
    const fy = (tileOrigin[1] - coordinate[1]) / (resolution * tileSize);
    const tileCol = Math.floor(fx);
    const tileRow = Math.floor(fy);
    const tileI = Math.floor((fx - tileCol) * tileSize);
    const tileJ = Math.floor((fy - tileRow) * tileSize);
    const matrixIds = tilegrid.getMatrixIds()[zoomIndex];
    const matrixSet = source.getMatrixSet();

    let url = template;

    url = url.replace('{TileMatrixSet}', matrixSet);
    url = url.replace('{TileMatrix}', matrixIds);
    url = url.replace('{TileCol}', tileCol);
    url = url.replace('{TileRow}', tileRow);
    url = url.replace('{I}', tileI);
    url = url.replace('{J}', tileJ);

    return url;
}

export default function (service, coordinate) {
    const view = window.app.map.getView();

    const requests = [];

    Object.values(service.olLayers).forEach(olLayer => {
        const layerIdentifier = olLayer.getSource().getLayer();

        const layer = service.layers.find(layer => {
            return (layer.Identifier === layerIdentifier);
        });

        if (typeof layer !== 'undefined') {
            const resourceJSON = layer.ResourceURL.find(resource => {
                return (resource.resourceType === 'FeatureInfo' && resource.format === 'application/json');
            });

            if (typeof resourceJSON === 'undefined') {
                throw new Error(`Unable to GetFeatureInfo on the layer "${layer.Identifier}" of the WMTS service "${service.capabilities.ServiceIdentification.Title}" !`);
            }

            if (service.mixedContent === false) {
                const url = WMTSGetFeatureInfoUrl(
                    resourceJSON.template,
                    coordinate,
                    olLayer.getSource(),
                    view.getResolution()
                );

                const promise = fetch(url)
                    .then(response => {
                        if (response.ok !== true) {
                            return null;
                        }

                        return response.json();
                    })
                    .then(response => {
                        return {
                            layer: layer.Identifier,
                            features: response === null ? [] : (new GeoJSON()).readFeatures(response)
                        };
                    });

                requests.push(promise);
            }
        }
    });

    return requests;
}
