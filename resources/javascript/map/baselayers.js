import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import TileLayer from 'ol/layer/Tile';
import {
    TileWMS,
    WMTS,
    XYZ
} from 'ol/source';
import {
    optionsFromCapabilities
} from 'ol/source/WMTS';

function loadBaselayer (index) {
    if (typeof window.app.baselayers[index] !== 'undefined') {
        let baselayer = window.app.baselayers[index];

        switch (baselayer.mode) {
        case 'wms':
            window.app.map.getLayers().setAt(0,
                new TileLayer({
                    source: new TileWMS({
                        attributions: baselayer.attributions,
                        maxZoom: baselayer.maxZoom,
                        params: {
                            LAYERS: baselayer.layers,
                            TRANSPARENT: false
                        },
                        url: baselayer.url
                    })
                })
            );
            break;

        case 'wmts':
            fetch(baselayer.url + '?service=wmts&request=GetCapabilities&version=1.1.0')
                .then(response => response.text())
                .then((text) => {
                    let capabilities = (new WMTSCapabilities()).read(text);

                    window.app.map.getLayers().setAt(0,
                        new TileLayer({
                            source: new WMTS(optionsFromCapabilities(capabilities, {
                                attributions: baselayer.attributions,
                                layer: baselayer.layer,
                                url: baselayer.url
                            }))
                        })
                    );
                });
            break;

        default:
            window.app.map.getLayers().setAt(0,
                new TileLayer({
                    source: new XYZ({
                        attributions: baselayer.attributions,
                        maxZoom: baselayer.maxZoom,
                        url: baselayer.url
                    })
                })
            );
            break;
        }
    }
}

export default function () {
    $('#baselayers button').on('click', (event) => {
        const { index } = $(event.target).data();

        $('#baselayers button.active').removeClass('active');
        $(event.target).addClass('active');

        loadBaselayer(index);
    });

    let keys = Object.keys(window.app.baselayers);

    $('#baselayers button[data-index=' + keys[0] + ']').addClass('active');
    loadBaselayer(keys[0]);
}
