export default function () {
    $('#btn-layers-add-wms').on('click', (event) => {
        let url = prompt('Enter the WMS service url :');

        if (url !== null && url !== '') {
            WMSLoadGetCapabilities(url)
                .then((id) => {
                    $('#modal-layers-services')
                        .val('wms:' + id)
                        .trigger('change');
                });
        }
    });
}
