export default function () {
    $('#btn-layers-add-wmts').on('click', (event) => {
        let url = prompt('Enter the WMTS service url :');

        if (url !== null && url !== '') {
            WMTSLoadGetCapabilities(url)
                .then((id) => {
                    $('#modal-layers-services')
                        .val('wmts:' + id)
                        .trigger('change');
                });
        }
    });
}
