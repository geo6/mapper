import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';

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
        throw new Error(`Unable to GetFeatureInfo on the WMS service "${service.capabilities.Service.Title}" ! It supports only "${formats.join('", "')}".`);
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

    const serviceIndex = window.app.wms.indexOf(service);

    return fetch(url)
        .then((response) => {
            if (response.ok !== true) {
                $(`#info-service-wms-${serviceIndex}`).remove();

                return false;
            }

            return response.text();
        })
        .then((response) => {
            let results = [];

            layers.forEach(layerName => {
                let layerFeatures = (new WMSGetFeatureInfo({
                    layers: [layerName]
                })).readFeatures(response);

                if (layerFeatures.length > 0) {
                    results.push({
                        layerName,
                        features: layerFeatures
                    });
                }
            });

            if (results.length === 0) {
                $(`#info-service-wms-${serviceIndex}`).remove();
            }

            return results;
        });
}
