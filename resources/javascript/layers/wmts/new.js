import WMTSLoadGetCapabilities from './capabilities';

export default function () {
    $('#btn-layers-add-wmts').on('click', (event) => {
        let url = prompt('Enter the WMTS service url :');

        if (url !== null && url !== '') {
            WMTSLoadGetCapabilities(url)
                .then((index) => {
                    $('#modal-layers-services')
                        .val('wmts:' + index)
                        .trigger('change');
                });
        }
    });
}
