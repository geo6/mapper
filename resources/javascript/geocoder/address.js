'use strict';

import GeoJSON from 'ol/format/GeoJSON';

/**
 * Launch geocoding query on every API configured and display result in sidebar.
 *
 * @param {string} address Address string sent to APIs.
 *
 * @returns {void}
 */
export default function (address) {
    window.app.geocoder.getSource().clear();
    $('#geocoder-results').empty();

    if ($.trim(address).length === 0) {
        window.app.sidebar.close('geocoder');
    } else {
        for (let key in window.app.geocoderProviders) {
            const provider = window.app.geocoderProviders[key];

            $(document.createElement('div'))
                .attr({
                    id: `geocoder-results-${key}`
                })
                .append([
                    `Results from <strong>${provider.title}</strong>`,
                    '<div class="loading text-muted"><i class="fas fa-spinner fa-spin"></i> Loading ...</div>',
                    '<hr>'
                ])
                .appendTo('#geocoder-results');

            const url = `${window.app.baseUrl}geocoder/${key}/address/${address}` + '?' + $.param({ c: window.app.custom });
            fetch(url)
                .then((response) => {
                    if (response.ok !== true) {
                        $(`#geocoder-results-${key}`).remove();

                        return false;
                    }

                    return response.json();
                })
                .then(geojson => {
                    const features = (new GeoJSON()).readFeatures(geojson, {
                        featureProjection: window.app.map.getView().getProjection()
                    });

                    window.app.geocoder.getSource().addFeatures(features);
                    window.app.geocoder.setVisible(true);

                    if (features.length > 0) {
                        const ol = $(document.createElement('ol'))
                            .addClass('mt-3');

                        features.forEach((feature) => {
                            const {
                                formattedAddress
                            } = feature.getProperties();

                            $(document.createElement('li'))
                                .append(formattedAddress)
                                .on('click', () => {
                                    window.app.map.getView().fit(feature.getGeometry(), {
                                        maxZoom: 18,
                                        padding: [15, 15, 15, 15]
                                    });
                                })
                                .appendTo(ol);
                        });

                        $(`#geocoder-results-${key} > .loading`).replaceWith(ol);

                        if (provider.attribution !== null) {
                            $(ol).after(`<div class="small text-right text-muted">${provider.attribution}</div>`);
                        }
                    } else {
                        $(`#geocoder-results-${key}`).remove();
                    }
                });
        }
    }
}
