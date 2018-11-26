import GeoJSON from 'ol/format/GeoJSON';

export default function (longitude, latitude) {
    window.app.geocoder.getSource().clear();
    $('#geocoder-results').empty();

    for (let key in window.app.geocoderProviders) {
        const provider = window.app.geocoderProviders[key];

        if (provider.reverse === false) {
            continue;
        }

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

        fetch(`${window.app.baseUrl}geocoder/${key}/reverse/${longitude}/${latitude}`)
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
                    const ol = document.createElement('ol');
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