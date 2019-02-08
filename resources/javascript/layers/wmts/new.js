'use strict';

import WMTS from './wmts';

export default function () {
    $('#btn-layers-add-wmts').on('click', (event) => {
        let url = prompt('Enter the WMTS service url :');

        if (url !== null && url !== '') {
            const wmts = new WMTS(url, (service) => {
                service.displayCapabilities();

                $('#modal-layers-select')
                    .val('wmts:' + service.getIndex())
                    .trigger('change');
            });
        }
    });
}
