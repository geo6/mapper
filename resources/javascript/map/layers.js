'use strict';

import {
    init as initFile,
    apply as FileApplySelection
} from '../layers/files';

import initWMS from '../layers/wms/init';
import WMSApplySelection from '../layers/wms/apply';

import initWMTS from '../layers/wmts/init';
import WMTSApplySelection from '../layers/wmts/apply';

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
        case 'modal-layers-optgroup-files':
            const type = $('#modal-layers-select').val();

            FileApplySelection(type);
            break;

        case 'modal-layers-optgroup-wms':
            WMSApplySelection(index);
            break;

        case 'modal-layers-optgroup-wmts':
            WMTSApplySelection(index);
            break;
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

    $(document).on('click', '.btn-layer-legend', (event) => {
        event.preventDefault();

        $(event.target).closest('li').find('div.layer-legend').toggle();
    });
}
