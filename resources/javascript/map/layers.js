import initCSV from '../layers/csv/init';
import CSVApplySelection from '../layers/csv/apply';
import CSVRemoveLayer from '../layers/csv/remove';

import initGeoJSON from '../layers/geojson/init';
import GeoJSONApplySelection from '../layers/geojson/apply';
import GeoJSONRemoveLayer from '../layers/geojson/remove';

import initGPX from '../layers/gpx/init';
import GPXApplySelection from '../layers/gpx/apply';
import GPXRemoveLayer from '../layers/gpx/remove';

import initKML from '../layers/kml/init';
import KMLApplySelection from '../layers/kml/apply';
import KMLRemoveLayer from '../layers/kml/remove';

import initWMS from '../layers/wms/init';
import WMSApplySelection from '../layers/wms/apply';

import initWMTS from '../layers/wmts/init';
import WMTSApplySelection from '../layers/wmts/apply';

export default function () {
    initCSV();
    initGeoJSON();
    initGPX();
    initKML();
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

            switch (type) {
            case 'csv':
                CSVApplySelection();
                break;

            case 'geojson':
                GeoJSONApplySelection();
                break;

            case 'gpx':
                GPXApplySelection();
                break;

            case 'kml':
                KMLApplySelection();
                break;
            }
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
            CSVRemoveLayer(index);
            break;
        case 'geojson':
            GeoJSONRemoveLayer(index);
            break;
        case 'gpx':
            GPXRemoveLayer(index);
            break;
        case 'kml':
            KMLRemoveLayer(index);
            break;
        case 'wms':
            window.app.wms[index].removeLayer(layer);
            break;
        case 'wmts':
            window.app.wmts[index].removeLayer(layer);
            break;
        }
    });

    $(document).on('click', '.btn-layer-legend', (event) => {
        event.preventDefault();

        $(event.target).closest('li').find('div.layer-legend').toggle();
    });
}
