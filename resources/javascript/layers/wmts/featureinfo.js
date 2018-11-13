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
            console.error(`Unable to GetFeatureInfo on the layer "${name}" of the WMTS service "${service.capabilities.ServiceIdentification.Title}" !`);

            return null;
        }

        const url = WMTSGetFeatureInfoUrl(
            template,
            coordinate,
            service.olLayers[key].getSource(),
            view.getResolution()
        );

        // To Do : handle error (4xx, 5xx)
        return fetch(url)
            .then(response => response.json())
            .then((response) => {
                // response = {
                //     'type': 'FeatureCollection',
                //     'features': [{
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1992-04-18T22:03:10.305Z',
                //             'modificati': '2010-01-13T17:25:00Z',
                //             'depth': 62.1232,
                //             'magnitude': 2.67
                //         },
                //         'id': 392635
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1990-02-21T18:53:31.273Z',
                //             'modificati': '2010-01-13T16:43:00Z',
                //             'depth': 37.7259,
                //             'magnitude': 2.048
                //         },
                //         'id': 417852
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '2005-06-22T03:20:50.779Z',
                //             'modificati': '2010-01-13T23:07:00Z',
                //             'depth': 33.0,
                //             'magnitude': 2.465
                //         },
                //         'id': 180306
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1997-12-29T06:20:45.410Z',
                //             'modificati': '2010-01-13T20:25:00Z',
                //             'depth': 12.0,
                //             'magnitude': 2.685
                //         },
                //         'id': 293731
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1990-05-15T19:10:56.823Z',
                //             'modificati': '2010-01-13T16:48:00Z',
                //             'depth': 6.3391,
                //             'magnitude': 1.793
                //         },
                //         'id': 414652
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '2009-05-09T18:37:50.833Z',
                //             'modificati': '2013-06-24T11:18:00Z',
                //             'depth': 53.043,
                //             'magnitude': 2.102
                //         },
                //         'id': 106198
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1990-02-22T00:06:59.396Z',
                //             'modificati': '2010-01-13T16:43:00Z',
                //             'depth': 38.3737,
                //             'magnitude': 2.007
                //         },
                //         'id': 417794
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1990-05-14T05:21:49.115Z',
                //             'modificati': '2010-01-13T16:48:00Z',
                //             'depth': 7.6984,
                //             'magnitude': 2.645
                //         },
                //         'id': 415072
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1989-01-14T13:38:57.168Z',
                //             'modificati': '2010-01-13T16:24:00Z',
                //             'depth': 58.9859,
                //             'magnitude': 3.25
                //         },
                //         'id': 428544
                //     },
                //     {
                //         'layer': 7328,
                //         'type': 'Feature',
                //         'properties': {
                //             'origintime': '1990-02-21T22:16:29.808Z',
                //             'modificati': '2010-01-13T16:43:00Z',
                //             'depth': 28.4922,
                //             'magnitude': 1.886
                //         },
                //         'id': 417814
                //     }
                //     ]
                // };

                result.push({
                    name,
                    features: (new GeoJSON()).readFeatures(response)
                });

                return result;
            });
    }
}
