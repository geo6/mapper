import GeoJSON from 'ol/format/GeoJSON';

export default function (longitude, latitude) {
    window.app.geocoder.getSource().clear();
    $('#geocoder-address-results').empty();

    const providers = [
        'urbis',
        'geopunt',
        'nominatim'
    ];

    providers.forEach((provider) => {
        fetch(`/geocoder/${provider}/reverse/${Math.round(longitude)}/${Math.round(latitude)}`)
            .then(response => response.json())
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

                    $(document.createElement('div'))
                        .append([
                            `Results from <strong>${provider}</strong>`,
                            ol
                        ])
                        .appendTo('#geocoder-address-results');
                }
            });
    });
}
