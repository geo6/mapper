import WMS from './wms';

export default function () {
    $('#btn-layers-add-wms').on('click', (event) => {
        let url = prompt('Enter the WMS service url :');

        if (url !== null && url !== '') {
            const wms = new WMS(url, (service) => {
                service.displayCapabilities();

                $('#modal-layers-services')
                    .val('wms:' + service.getIndex())
                    .trigger('change');
            });
        }
    });
}
