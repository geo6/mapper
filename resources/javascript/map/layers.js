import Resumable from 'resumablejs/resumable';

import WMSAddLayerToMap from '../layers/wms/map';
import WMSUpdateLayers from '../layers/wms/sidebar';
import WMSLoadGetCapabilities from '../layers/wms/capabilities';

import WMTSAddLayerToMap from '../layers/wmts/map';
import WMTSUpdateLayers from '../layers/wmts/sidebar';
import WMTSLoadGetCapabilities from '../layers/wmts/capabilities';

export function initLayers() {
    window.app.wms = [];
    window.app.wmts = [];

    for (let i = 0; i < window.app.layers.length; i++) {
        let layer = window.app.layers[i];

        switch (layer.type) {
            case 'wms':
                WMSLoadGetCapabilities(layer.url)
                    .then((id) => {
                        if (typeof layer.layers !== 'undefined' && layer.layers.length > 0) {
                            let layers = [];

                            for (let i = 0; i < window.app.wms[id].layers.length; i++) {
                                if (layer.layers.indexOf(window.app.wms[id].layers[i].Name) > -1) {
                                    layers.push(window.app.wms[id].layers[i]);
                                }
                            }

                            WMSAddLayerToMap(id, layers);
                            displayLayersButton('wms', id, layers);
                        }
                    });
                break;

            case 'wmts':
                WMTSLoadGetCapabilities(layer.url)
                    .then((id) => {
                        if (typeof layer.layer !== 'undefined') {
                            let layers = [];

                            for (let i = 0; i < window.app.wmts[id].layers.length; i++) {
                                if (window.app.wmts[id].layers[i].Identifier === layer.layer) {
                                    layers.push(window.app.wmts[id].layers[i]);
                                    break;
                                }
                            }

                            WMTSAddLayerToMap(id, layers[0]);
                            displayLayersButton('wmts', id, layers);
                        }
                    });
                break;
        }
    }

    $('#modal-layers-services').on('change', (event) => {
        let target = $(event.target).find('option:selected').data('target');

        $('#modal-layers-layers > div').hide();
        $(target).show();
    });

    $('#btn-layers-add-wms').on('click', (event) => {
        let url = prompt('Enter the WMS service url :');

        if (url !== null && url !== '') {
            WMSLoadGetCapabilities(url)
                .then((id) => {
                    $('#modal-layers-services')
                        .val('wms:' + id)
                        .trigger('change');
                });
        }
    });
    $('#btn-layers-add-wmts').on('click', (event) => {
        let url = prompt('Enter the WMTS service url :');

        if (url !== null && url !== '') {
            WMTSLoadGetCapabilities(url)
                .then((id) => {
                    $('#modal-layers-services')
                        .val('wmts:' + id)
                        .trigger('change');
                });
        }
    });

    $('#btn-layers-apply').on('click', (event) => {
        event.preventDefault();

        let option = $('#modal-layers-services option:selected');
        if ($(option).closest('optgroup').attr('id') === 'modal-layers-services-wms') {
            let id = $('#modal-layers-services-wms > option').index(option);

            let names = [];
            $('#modal-layers-layers .list-group-item.list-group-item-primary').each((index, element) => {
                names.push($(element).data('name'));

                $(element).removeClass('list-group-item-primary');
            });

            let layers = [];
            for (let i = 0; i < window.app.wms[id].layers.length; i++) {
                if (names.indexOf(window.app.wms[id].layers[i].Name) > -1) {
                    layers.push(window.app.wms[id].layers[i]);
                }
            }

            WMSAddLayerToMap(id, layers);
            displayLayersButton('wms', id, layers);
        } else if ($(option).closest('optgroup').attr('id') === 'modal-layers-services-wmts') {
            let id = $('#modal-layers-services-wmts > option').index(option);

            let names = [];
            $('#modal-layers-layers .list-group-item.list-group-item-primary').each((index, element) => {
                names.push($(element).data('name'));

                $(element).removeClass('list-group-item-primary');
            });

            let layers = [];
            for (let i = 0; i < window.app.wmts[id].layers.length; i++) {
                if (names.indexOf(window.app.wmts[id].layers[i].Identifier) > -1) {
                    layers.push(window.app.wmts[id].layers[i]);
                }
            }

            // ToDo: Define what to do with mutlipe layers from same WMTS

            WMTSAddLayerToMap(id, layers[0]);
            displayLayersButton('wmts', id, layers);
        }
    });

    $(document).on('click', '.btn-layer-remove', (event) => {
        event.preventDefault();

        let data = $(event.target).closest('li').data();

        $(event.target).closest('li').remove();

        switch (data.type) {
            case 'wms':
                WMSUpdateLayers();
                break;
            case 'wmts':
                WMTSUpdateLayers();
                break;
        }
    });
    $(document).on('click', '.btn-layer-legend', (event) => {
        event.preventDefault();

        $(event.target).closest('li').find('div.layer-legend').toggle();
    });
}

export function uploadLayer() {
    let r = new Resumable({
        fileType: [
            'json',
            'geojson'
        ],
        target: '/upload'
    });
    r.assignBrowse(document.getElementById('btn-layers-upload'));
    r.on('fileAdded', (file, event) => {
        console.log(file);
        r.upload();
    });
    r.on('fileSuccess', (file, message) => {
        console.log(message);
    });
}

function displayLayersButton(type, id, layers) {
    for (let i = 0; i < layers.length; i++) {
        let li = $('#layers-new').clone();
        let divName = $(li).find('div.layer-name');

        let name = layers[i].Name || layers[i].Identifier;

        $(li)
            .data({
                type: type,
                id: id,
                layer: name
            })
            .attr({
                id: 'layers-' + type + '-' + id + '-' + i
            })
            .show()
            .appendTo('#layers .list-group');

        $(li)
            .find('div.layer-name')
            .addClass('text-nowrap text-truncate')
            .attr({
                title: name
            })
            .html(
                (layers[i].queryable === true ? '<i class="fas fa-info-circle"></i> ' : '')
                + layers[i].Title
            );

        if (
            typeof layers[i].Style !== 'undefined' && layers[i].Style.length > 0 &&
            typeof layers[i].Style[0].LegendURL !== 'undefined' && layers[i].Style[0].LegendURL.length > 0
        ) {
            let img = document.createElement('img');

            img.src = layers[i].Style[0].LegendURL[0].OnlineResource;
            img.alt = `Legend "${name}"`;

            img.classList.add('img-fluid');

            $(li).find('div.layer-legend').html(img);

            $(li).find('.btn-layer-legend')
                .removeClass('disabled')
                .prop('disabled', false);
        }
    }
}
