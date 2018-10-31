import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import {
    Tile as TileLayer
} from 'ol/layer';
import {
    fromLonLat,
    toLonLat
} from 'ol/proj';
import {
    WMTS
} from 'ol/source';
import {
    optionsFromCapabilities
} from 'ol/source/WMTS';

/**
 *
 */
export function GetCapabilities(url) {
    return fetch('/proxy?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0&_url=' + encodeURIComponent(url))
        .then(response => response.text())
        .then((text) => {
            let capabilities = (new WMTSCapabilities()).read(text);

            return {
                capabilities: capabilities,
                layers: parseLayers(capabilities.Contents.Layer)
            };
        });
}

/**
 *
 */
export function loadGetCapabilities(url) {
    return GetCapabilities(url)
        .then((result) => {
            let crs = [];
            for (let m = 0; m < result.capabilities.Contents.TileMatrixSet.length; m++) {
                crs.push(result.capabilities.Contents.TileMatrixSet[m].SupportedCRS);
            }

            if (crs.indexOf('EPSG:3857') === -1) {
                console.error('The WMTS service "' + url + '" does not support EPSG:3857 ! It supports only ' + crs.join(', ') + '.');

                return null;
            } else {
                let i = window.app.wmts.push({
                    capabilities: result.capabilities,
                    layers: result.layers,
                    olLayer: null,
                    selection: []
                });

                let option = document.createElement('option');

                $(option)
                    .text(result.capabilities.ServiceIdentification.Title)
                    .attr('value', 'wmts:' + (i - 1))
                    .data('target', '#modal-layers-services-wmts-' + (i - 1));

                $('#modal-layers-services-wmts').append(option).show();

                let div = document.createElement('div');
                let title = document.createElement('strong');
                let description = document.createElement('p');

                $(title)
                    .text(result.capabilities.ServiceIdentification.Title)
                    .appendTo(div);
                $(description)
                    .addClass('text-info small')
                    .text(result.capabilities.ServiceIdentification.Abstract)
                    .appendTo(div);
                $(div)
                    .append(generateLayersList((i - 1), result.capabilities.Contents.Layer))
                    .attr('id', 'modal-layers-services-wmts-' + (i - 1))
                    .hide();

                $('#modal-layers-layers').append(div);

                return (i - 1);
            }
        });
}

/**
 *
 */
export function addLayerToMap(id, layer) {
    if (typeof window.app.wmts[id] !== 'undefined' && typeof layer === 'object') {
        let service = window.app.wmts[id].capabilities;

        let name = layer.Identifier;

        // ToDo: Define what to do with mutlipe layers from same WMTS
        window.app.map.removeLayer(window.app.wmts[id].olLayer);
        window.app.wmts[id].olLayer = null;

        if (window.app.wmts[id].olLayer === null) {
            window.app.wmts[id].olLayer = new TileLayer({
                source: new WMTS(optionsFromCapabilities(service, {
                    layer: name
                }))
            });

            window.app.map.addLayer(window.app.wmts[id].olLayer);
        } else {
            // ToDo: Define what to do with mutlipe layers from same WMTS
        }
    }
}

/**
 *
 */
export function updateLayers() {
    let wmts = [];
    for (let i = 0; i < window.app.wmts.length; i++) {
        wmts[i] = [];
    }
    $('#layers-list > li[id^=layers-wmts]:visible').each((index, element) => {
        let data = $(element).data();

        wmts[data.id].push(data.layer);
    });

    for (let i = 0; i < window.app.wmts.length; i++) {
        if (wmts[i].length === 0 && window.app.wmts[i].olLayer !== null) {
            window.app.map.removeLayer(window.app.wmts[i].olLayer);
            window.app.wmts[i].olLayer = null;
        } else if (wmts[i].length > 0) {
            // ToDo: Define what to do with mutlipe layers from same WMTS
        }
    }
}

/**
 *
 */
function parseLayers(layers, searchElements) {
    let results = [];

    for (let i = 0; i < layers.length; i++) {
        /*if (typeof layers[i].Layer !== 'undefined') {
            results = results.concat(parseLayers(layers[i].Layer, searchElements));
        } else*/
        if (typeof searchElements !== 'undefined' && searchElements.indexOf(layers[i].Name) > -1) {
            results.push(layers[i]);
        } else if (typeof searchElements === 'undefined') {
            results.push(layers[i]);
        }
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

        $(li)
            .attr('id', 'wmts-' + id + '-' + layers[i].Identifier)
            .data({
                name: layers[i].Identifier
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
                $(badge).text(layers[i].Identifier)
            ])
            .appendTo(li);

        if (typeof layers[i].Abstract !== 'undefined' && layers[i].Abstract !== '') {
            let p = document.createElement('p');

            $(p)
                .addClass('text-info small')
                .html(layers[i].Abstract.replace(/(\r\n|\n\r|\r|\n)/g, '<br>' + '$1'))
                .appendTo(li);
        }

        /*if (typeof layers[i].Layer !== 'undefined') {
            $(li).append(generateLayersList(id, layers[i].Layer));
        }*/
    }

    return ul;
}
