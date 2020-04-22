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
}
