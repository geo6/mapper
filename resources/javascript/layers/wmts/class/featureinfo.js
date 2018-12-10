/**
 * See https://github.com/openlayers/openlayers/issues/2368
 * See https://github.com/openlayers/openlayers/pull/2373
 * See https://github.com/openlayers/openlayers/pull/3150
 */

import GeoJSON from 'ol/format/GeoJSON';
// import {
//     appendParams
// } from 'ol/uri';

function WMTSGetFeatureInfoUrl (template, coordinate, source, resolution) {
    const tilegrid = source.getTileGrid();
    const tileResolutions = tilegrid.getResolutions();

    let zoomIndex = Infinity;
    let diff = Infinity;

    for (let i = 0; i < tileResolutions.length; i++) {
        const tileResolution = tileResolutions[i];

        let diffP = Math.abs(resolution - tileResolution);

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

    // return appendParams(url, {
    //     SERVICE: 'WMTS',
    //     REQUEST: 'GetFeatureInfo',
    //     VERSION: source.getVersion(),
    //     LAYER: source.getLayer(),
    //     INFOFORMAT: 'application/json',
    //     STYLE: source.getStyle(),
    //     FORMAT: source.getFormat(),
    //     TileCol: tileCol,
    //     TileRow: tileRow,
    //     TileMatrix: matrixIds,
    //     TileMatrixSet: matrixSet,
    //     I: tileI,
    //     J: tileJ
    // });
}

export default function (service, coordinate) {
    const view = window.app.map.getView();

    let result = [];

    for (const key in service.olLayers) {
        const name = service.olLayers[key].getSource().getLayer();

        let template = null;
        service.capabilities.Contents.Layer.forEach((layer) => {
            if (layer.Identifier === name && typeof layer.ResourceURL !== 'undefined') {
                layer.ResourceURL.forEach((resource) => {
                    if (resource.resourceType === 'FeatureInfo' && resource.format === 'application/json') {
                        template = resource.template;

                        return false;
                    }
                });

                return false;
            }
        });

        if (template === null) {
            throw new Error(`Unable to GetFeatureInfo on the layer "${name}" of the WMTS service "${service.capabilities.ServiceIdentification.Title}" !`);
        }

        const url = WMTSGetFeatureInfoUrl(
            template,
            coordinate,
            service.olLayers[key].getSource(),
            view.getResolution()
        );

        const serviceIndex = service.getIndex();

        return fetch(url)
            .then((response) => {
                if (response.ok !== true) {
                    $(`#info-service-wmts-${serviceIndex}`).remove();

                    return false;
                }

                return response.json();
            })
            .then((response) => {
                let layerFeatures = (new GeoJSON()).readFeatures(response);

                if (layerFeatures.length > 0) {
                    result.push({
                        name,
                        features: layerFeatures
                    });
                } else {
                    $(`#info-service-wmts-${serviceIndex}`).remove();
                }

                return result;
            });
    }
}
