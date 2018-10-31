import {
    WMSCapabilities,
    WMSGetFeatureInfo
} from 'ol/format';
import {
    Tile as TileLayer
} from 'ol/layer';
import {
    fromLonLat,
    toLonLat
} from 'ol/proj';
import {
    TileWMS
} from 'ol/source';

/**
 *
 */
export function GetCapabilities(url) {
    return fetch('/proxy?SERVICE=WMS&REQUEST=GetCapabilities&_url=' + encodeURIComponent(url))
        .then(response => response.text())
        .then((text) => {
            let capabilities = (new WMSCapabilities()).read(text);

            return {
                capabilities: capabilities,
                layers: typeof capabilities.Capability.Layer.Layer !== 'undefined' ? parseLayers(capabilities.Capability.Layer.Layer) : parseLayers(capabilities.Capability.Layer)
            };
        });
}

/**
 *
 */
export function loadGetCapabilities(url) {
    return GetCapabilities(url)
        .then((result) => {
            if (typeof result.capabilities.Capability.Layer.CRS !== 'undefined' && result.capabilities.Capability.Layer.CRS.indexOf('EPSG:3857') === -1) {
                console.error('The WMS service "' + url + '" does not support EPSG:3857 ! It supports only ' + result.capabilities.Capability.Layer.CRS.join(', ') + '.');

                return null;
            } else {
                let i = window.app.wms.push({
                    capabilities: result.capabilities,
                    layers: result.layers,
                    olLayer: null,
                    selection: []
                });

                let option = document.createElement('option');

                $(option).text(result.capabilities.Service.Title)
                    .attr('value', 'wms:' + (i - 1))
                    .data('target', '#modal-layers-services-wms-' + (i - 1));

                $('#modal-layers-services-wms').append(option).show();

                let div = document.createElement('div');
                let title = document.createElement('strong');
                let description = document.createElement('p');

                $(title).text(result.capabilities.Service.Title)
                    .appendTo(div);
                $(description).addClass('text-info small')
                    .text(result.capabilities.Service.Abstract)
                    .appendTo(div);
                $(div).append(generateLayersList((i - 1), result.layers))
                    .attr('id', 'modal-layers-services-wms-' + (i - 1))
                    .hide();

                $('#modal-layers-layers').append(div);

                return (i - 1);
            }
        });
}

/**
 *
 */
export function addLayerToMap(id, layers) {
    if (typeof window.app.wms[id] !== 'undefined' && layers.length > 0) {
        let service = window.app.wms[id].capabilities;

        let names = [];
        for (let i = 0; i < layers.length; i++) {
            names.push(layers[i].Name);
        }

        if (window.app.wms[id].olLayer === null) {
            window.app.wms[id].olLayer = new TileLayer({
                source: new TileWMS({
                    params: {
                        'LAYERS': names
                    },
                    url: service.Service.OnlineResource
                })
            });

            window.app.map.addLayer(window.app.wms[id].olLayer);
        } else {
            let params = window.app.wms[id].olLayer.getSource().getParams();
            window.app.wms[id].olLayer.getSource().updateParams({
                'LAYERS': params.LAYERS.concat(names)
            });
        }

        /*
                let extent = null;

                // ToDo: Get extent for each layer if available and compute extent

                if (extent === null && typeof service.Capability.Layer.BoundingBox !== 'undefined') {
                    for (let i = 0; i < service.Capability.Layer.BoundingBox.length; i++) {
                        let bbox = service.Capability.Layer.BoundingBox[i];

                        if (bbox.crs === 'EPSG:3857') {
                            extent = bbox.extent;
                            break;
                        } else if (bbox.crs === 'EPSG:4326') {
                            let min = fromLonLat([bbox.extent[0], bbox.extent[1]]);
                            let max = fromLonLat([bbox.extent[2], bbox.extent[3]]);

                            extent = [
                                min[0],
                                min[1],
                                max[0],
                                max[1]
                            ];
                            break;
                        }
                    }
                }

                if (extent !== null) {
                    window.app.map.getView().fit(extent);
                }
        */
    }
}

/**
 *
 */
export function updateLayers() {
    let wms = [];
    for (let i = 0; i < window.app.wms.length; i++) {
        wms[i] = [];
    }
    $('#layers-list > li[id^=layers-wms]:visible').each((index, element) => {
        let data = $(element).data();
        wms[data.id].push(data.layer);
    });

    for (let i = 0; i < window.app.wms.length; i++) {
        if (wms[i].length === 0 && window.app.wms[i].olLayer !== null) {
            window.app.map.removeLayer(window.app.wms[i].olLayer);
            window.app.wms[i].olLayer = null;
        } else if (wms[i].length > 0) {
            window.app.wms[i].olLayer.getSource().updateParams({
                'LAYERS': wms[i]
            });
        }
    }
}

/**
 *
 */
export function getFeatureInfo(service, coordinate) {
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

/**
 *
 */
function parseLayers(layers, searchElements) {
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

/**
 *
 */
function generateLayersList(id, layers) {
    let ul = document.createElement('ul');

    $(ul).addClass('list-group mb-3');

    for (let i = 0; i < layers.length; i++) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        let badge = $(document.createElement('span')).addClass('badge badge-light ml-1');

        $(li).attr('id', 'wms-' + id + '-' + layers[i].Name)
            .data({
                name: layers[i].Name
            })
            .addClass('list-group-item')
            .on('click', (event) => {
                event.stopPropagation();

                $(event.delegateTarget).toggleClass('list-group-item-primary');
            })
            .appendTo(ul);

        $(div)
            .append([
                (layers[i].queryable === true ? '<i class="fas fa-info-circle"></i> ' : ''),
                layers[i].Title,
                $(badge).text(layers[i].Name)
            ])
            .appendTo(li);

        if (typeof layers[i].Abstract !== 'undefined' && layers[i].Abstract !== '') {
            let p = document.createElement('p');

            $(p).addClass('text-info small')
                .html(layers[i].Abstract.replace(/(\r\n|\n\r|\r|\n)/g, '<br>' + '$1'))
                .appendTo(li);
        }

        if (typeof layers[i].Layer !== 'undefined') {
            $(li).append(generateLayersList(id, layers[i].Layer));
        }
    }

    return ul;
}
