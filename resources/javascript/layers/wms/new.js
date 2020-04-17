'use strict';

import WMS from './wms';

export default function () {
    $('#btn-layers-add-wms').on('click', (event) => {
        const url = prompt('Enter the WMS service url :');

        if (url !== null && url !== '') {
            const wms = new WMS(url, (service) => {
                service.displayCapabilities();

                $('#modal-layers-select')
                    .val('wms:' + service.getIndex())
                    .trigger('change');
            });

            window.app.wms.push(wms);
        }
    });
}
