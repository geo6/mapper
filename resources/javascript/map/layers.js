import initWMS from '../layers/wms/init';
import WMSApplySelection from '../layers/wms/apply';
import WMSRemoveLayer from '../layers/wms/remove';

import initWMTS from '../layers/wmts/init';
import WMTSApplySelection from '../layers/wmts/apply';
import WMTSRemoveLayer from '../layers/wmts/remove';

export default function () {
    initWMS();
    initWMTS();

    $('#modal-layers-services').on('change', (event) => {
        let { target, upload } = $(event.target).find('option:selected').data();

        if (upload == true) {
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
            case 'modal-layers-services-wms':
                const indexWMS = $('#modal-layers-services-wms > option').index(option);

                WMSApplySelection(indexWMS);
                break;

            case 'modal-layers-services-wmts':
                const indexWMTS = $('#modal-layers-services-wmts > option').index(option);

                WMTSApplySelection(indexWMTS);
                break;
        }
    });

    $(document).on('click', '.btn-layer-remove', (event) => {
        event.preventDefault();

        let data = $(event.target).closest('li').data();

        $(event.target).closest('li').remove();

        switch (data.type) {
            case 'wms':
                WMSRemoveLayer();
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
