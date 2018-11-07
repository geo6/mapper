import WMSLoadGetCapabilities from './capabilities';

export default function () {
    $('#btn-layers-add-wms').on('click', (event) => {
        let url = prompt('Enter the WMS service url :');

        if (url !== null && url !== '') {
            WMSLoadGetCapabilities(url)
                .then((index) => {
                    $('#modal-layers-services')
                        .val('wms:' + index)
                        .trigger('change');
                });
        }
    });
}
