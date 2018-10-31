import {
    WMTSCapabilities
} from 'ol/format';
import {
    Tile as TileLayer
} from 'ol/layer';
import {
    TileWMS,
    WMTS,
    XYZ
} from 'ol/source';
import {
    optionsFromCapabilities
} from 'ol/source/WMTS';

function loadBaselayer(id) {
    if (typeof window.app.baselayers[id] !== 'undefined') {
        let baselayer = window.app.baselayers[id];

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
        let id = $(event.target).data('id');

        $('#baselayers button.active').removeClass('active');
        $(event.target).addClass('active');

        loadBaselayer(id);
    });

    let keys = Object.keys(window.app.baselayers);

    $('#baselayers button[data-id=' + keys[0] + ']').addClass('active');
    loadBaselayer(keys[0]);
}
