'use strict';

import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';

import { map } from '../../../main';

export default function (service, coordinate) {
    const source = service.olLayer.getSource();
    const view = map.getView();

    const formats = service.capabilities.Capability.Request.GetFeatureInfo.Format;

    let format = null;
    if (formats.indexOf('application/vnd.ogc.gml') !== -1) {
        format = 'application/vnd.ogc.gml';
    } else if (formats.indexOf('application/vnd.ogc.wms_xml') !== -1) {
        format = 'application/vnd.ogc.wms_xml';
    } else if (formats.indexOf('text/xml') !== -1) {
        format = 'text/xml';
    }

    if (format === null) {
        throw new Error(`Unable to GetFeatureInfo on the WMS service "${service.capabilities.Service.Title}" ! It supports only "${formats.join('", "')}".`);
    }

    const requests = [];

    const activeLayers = service.olLayer.getSource().getParams().LAYERS || [];
    activeLayers.forEach(layerName => {
        const layer = service.layers.find(layer => {
            return (layer.Name === layerName);
        });

        if (typeof layer !== 'undefined' && layer.queryable === true && service.mixedContent === false) {
            const url = source.getFeatureInfoUrl(
                coordinate,
                view.getResolution(),
                view.getProjection(), {
                    FEATURE_COUNT: 99,
                    INFO_FORMAT: format,
                    QUERY_LAYERS: [layer.Name]
                }
            );

            const promise = fetch(url)
                .then(response => {
                    if (response.ok !== true) {
                        return null;
                    }

                    return response.text();
                })
                .then(response => {
                    return {
                        layer: layer.Name,
                        features: response === null ? [] : (new WMSGetFeatureInfo()).readFeatures(response)
                    };
                });

            requests.push(promise);
        }
    });

    return requests;
}
