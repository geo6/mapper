'use strict';

import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import TileLayer from 'ol/layer/Tile';
import {
    TileWMS,
    WMTS,
    XYZ
} from 'ol/source';
import { optionsFromCapabilities } from 'ol/source/WMTS';

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
            const url = baselayer.url + '?' + $.param({
                SERVICE: 'WMTS',
                REQUEST: 'GetCapabilities',
                VERSION: '1.0.0'
            });
            fetch(url)
                .then(response => response.text())
                .then((text) => {
                    let capabilities = (new WMTSCapabilities()).read(text);

                    let options = optionsFromCapabilities(capabilities, {
                        layer: baselayer.layer
                    });
                    options.attributions = baselayer.attributions;

                    window.app.map.getLayers().setAt(0,
                        new TileLayer({
                            source: new WMTS(options)
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

        window.app.cache.setBaselayer(index);
    });

    const keys = Object.keys(window.app.baselayers);
    if (typeof window.app.cache.baselayer === 'undefined' || window.app.cache.baselayer === null) {
        window.app.cache.setBaselayer(keys[0]);
    }

    $('#baselayers button[data-index=' + window.app.cache.baselayer + ']').addClass('active');
    loadBaselayer(window.app.cache.baselayer);
}
