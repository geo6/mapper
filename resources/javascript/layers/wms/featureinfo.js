import {
    WMSGetFeatureInfo
} from 'ol/format';

export default function (service, coordinate) {
    let source = service.olLayer.getSource();
    let view = window.app.map.getView();

    let formats = service.capabilities.Capability.Request.GetFeatureInfo.Format;

    let format = null;
    if (formats.indexOf('application/vnd.ogc.gml') !== -1) {
        format = 'application/vnd.ogc.gml';
    } else if (formats.indexOf('application/vnd.ogc.wms_xml') !== -1) {
        format = 'application/vnd.ogc.wms_xml';
    } else if (formats.indexOf('text/xml') !== -1) {
        format = 'text/xml';
    }

    if (format === null) {
        console.error(`Unable to GetFeatureInfo on the WMS service "${service.capabilities.Service.OnlineResource}" ! It supports only "${formats.join('", "')}".`);

        return null;
    }

    let url = source.getGetFeatureInfoUrl(
        coordinate,
        view.getResolution(),
        view.getProjection(), {
            'INFO_FORMAT': format,
            'FEATURE_COUNT': 99
        }
    );

    let layers = source.getParams().LAYERS;

    return fetch(url)
        .then(response => response.text())
        .then((response) => {
            let result = [];

            layers.forEach(layerName => {
                let layerFeatures = (new WMSGetFeatureInfo({
                    layers: [layerName]
                })).readFeatures(response);

                result.push({
                    layerName,
                    features: layerFeatures
                });
            });

            return result;
        });
}
