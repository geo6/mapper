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
import WMTSRemoveLayer from '../layers/wmts/remove';

export default function () {
    initGeoJSON();
    initGPX();
    initKML();
    initWMS();
    initWMTS();

    $('#modal-layers-services').on('change', (event) => {
        let { target, upload } = $(event.target).find('option:selected').data();

        if (upload === true) {
            $('#progress-upload').show();
        } else {
            $('#progress-upload').hide();
        }

        $('#modal-layers-layers > div').hide();
        $(target).show();
    }).trigger('change');

    $('#btn-layers-apply').on('click', (event) => {
        event.preventDefault();

        const option = $('#modal-layers-services option:selected');
        const id = $(option).closest('optgroup').attr('id');

        switch (id) {
        case 'modal-layers-files':
            const type = $('#modal-layers-services').val();

            switch (type) {
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

        case 'modal-layers-services-wms':
            const { index } = $(option).data();

            WMSApplySelection(index);
            break;

        case 'modal-layers-services-wmts':
            const indexWMTS = $('#modal-layers-services-wmts > option').index(option);

            WMTSApplySelection(indexWMTS);
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
            WMTSRemoveLayer();
            break;
        }
    });

    $(document).on('click', '.btn-layer-legend', (event) => {
        event.preventDefault();

        $(event.target).closest('li').find('div.layer-legend').toggle();
    });
}
