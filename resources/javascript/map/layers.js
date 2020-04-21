'use strict';

import {
    init as initFile,
    apply as FileApplySelection
} from '../layers/files';

import initWMS from '../layers/wms/init';
import WMSApplySelection from '../layers/wms/apply';

import initWMTS from '../layers/wmts/init';
import WMTSApplySelection from '../layers/wmts/apply';

let layerSettings = null;

export default function () {
    initFile('csv');
    initFile('geojson');
    initFile('gpx');
    initFile('kml');

    initWMS();
    initWMTS();

    $('#modal-layers-select').on('change', (event) => {
        const type = $(event.target).val();
        const { target, upload } = $(event.target).find('option:selected').data();

        $('#modal-layers-format-help > div').hide();

        if (upload === true) {
            $('#progress-upload').show();
            $(`#modal-layers-format-help, #modal-layers-format-help-${type}`).show();
        } else {
            $('#progress-upload').hide();
            $('#modal-layers-format-help').hide();
        }

        $('#modal-layers-layers > div').hide();
        $(target).show();
    }).trigger('change');

    $('#btn-layers-apply').on('click', (event) => {
        event.preventDefault();

        const option = $('#modal-layers-select > optgroup > option:selected');
        const id = $(option).closest('optgroup').attr('id');
        const { index } = $(option).data();

        switch (id) {
        case 'modal-layers-optgroup-files': {
            const type = $('#modal-layers-select').val();

            FileApplySelection(type);
            break;
        }
        case 'modal-layers-optgroup-wms': {
            WMSApplySelection(index);
            break;
        }
        case 'modal-layers-optgroup-wmts': {
            WMTSApplySelection(index);
            break;
        }
        }
    });

    $(document).on('click', '.btn-layer-remove', (event) => {
        event.preventDefault();

        const {
            type,
            index,
            layer
        } = $(event.target).closest('li').data();

        $(event.target).closest('li').remove();

        switch (type) {
        case 'csv':
            window.app.csv[index].removeFromMap();
            break;
        case 'geojson':
            window.app.geojson[index].removeFromMap();
            break;
        case 'gpx':
            window.app.gpx[index].removeFromMap();
            break;
        case 'kml':
            window.app.kml[index].removeFromMap();
            break;
        case 'wms':
            window.app.wms[index].removeLayer(layer);
            break;
        case 'wmts':
            window.app.wmts[index].removeLayer(layer);
            break;
        }
    });

    $(document).on('click', '.btn-layer-zoom', (event) => {
        event.preventDefault();

        const {
            type,
            index,
            layer
        } = $(event.target).closest('li').data();

        switch (type) {
        case 'csv':
            window.app.csv[index].zoom();
            break;
        case 'geojson':
            window.app.geojson[index].zoom();
            break;
        case 'gpx':
            window.app.gpx[index].zoom();
            break;
        case 'kml':
            window.app.kml[index].zoom();
            break;
        case 'wms':
            window.app.wms[index].zoom(layer);
            break;
        case 'wmts':
            // window.app.wmts[index].zoom(layer);
            break;
        }
    });

    $(document).on('click', '.btn-layer-settings', (event) => {
        event.preventDefault();

        const { type, index, layer } = $(event.target).closest('li').data();

        switch (type) {
        case 'csv':
            layerSettings = window.app.csv[index];
            break;
        case 'geojson':
            layerSettings = window.app.geojson[index];
            break;
        case 'gpx':
            layerSettings = window.app.gpx[index];
            break;
        case 'kml':
            layerSettings = window.app.kml[index];
            break;
        }

        const columns = layerSettings.getColumns();

        document.querySelector('#modal-settings .modal-body > strong').innerText = layer;

        document.getElementById('layer-label').innerHTML = '<option value=""></option>';
        columns.filter(c => c !== 'geometry').forEach((column) => {
            const option = document.createElement('option');
            option.value = column;
            option.innerText = column;
            option.selected = (column === layerSettings.label);

            document.getElementById('layer-label').append(option);
        });

        if (layerSettings.type === 'geojson' && typeof layerSettings.content.legend === 'object' && Array.isArray(layerSettings.content.legend)) {
            document.getElementById('layer-color').disabled = true;
            document.getElementById('layer-color').value = '';
            document.getElementById('layer-color-text').innerText = 'Function disabled because this layer has a legend.';
            document.getElementById('layer-color-text').hidden = false;
        } else if (layerSettings.type === 'kml') {
            document.getElementById('layer-color').disabled = true;
            document.getElementById('layer-color').value = '';
            document.getElementById('layer-color-text').innerText = 'Function disabled for KML files.';
            document.getElementById('layer-color-text').hidden = false;
        } else {
            document.getElementById('layer-color').disabled = false;
            document.getElementById('layer-color').value = layerSettings.color;
            document.getElementById('layer-color-text').innerText = '';
            document.getElementById('layer-color-text').hidden = true;
        }

        $('#modal-settings').modal('show');
    });

    document.querySelector('#modal-settings form').addEventListener('submit', (event) => {
        event.preventDefault();

        let label = document.getElementById('layer-label').value;
        if (label.length === 0) { label = null; }

        layerSettings.label = label;

        let color = document.getElementById('layer-color').value;
        if (color.length === 0) { color = null; }

        layerSettings.color = color;

        layerSettings.olLayer.changed();

        layerSettings = null;

        $('#modal-settings').modal('hide');
    });

    $(document).on('click', '.btn-layer-legend', (event) => {
        event.preventDefault();

        $(event.target).closest('li').find('div.layer-legend').toggle();
    });
}
