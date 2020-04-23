'use strict';

import displayLocation from '../info/location';

import { map } from '../main';

export default function () {
    map.on('singleclick', (event) => {
        window.app.marker.setGeometry(null);

        displayLocation(event.coordinate);

        $('#info-list').empty().show();
        $('#info-details').hide();
        $('#info-details > table > caption, #info-details > table > tbody').empty();
        $('#info-details-geometry').empty().hide();

        $('#infos-list-btn-prev, #infos-list-btn-next').prop('disabled', true);
        $('#infos-details-btn-locate').off().prop('disabled', true);

        // Draw
        const features = window.app.draw.getFeatureInfo(event.coordinate);
        if (features !== null && features.length > 0) {
            window.app.draw.displayFeaturesList(features);
        }

        // CSV
        window.app.csv.forEach(file => {
            const features = file.getFeatureInfo(event.coordinate);

            file.selection = features;

            if (features !== null && features.length > 0) {
                file.displayFeaturesList(features);
            }
        });

        // GeoJSON
        window.app.geojson.forEach(file => {
            const features = file.getFeatureInfo(event.coordinate);

            file.selection = features;

            if (features !== null && features.length > 0) {
                file.displayFeaturesList(features);
            }
        });

        // GPX
        window.app.gpx.forEach(file => {
            const features = file.getFeatureInfo(event.coordinate);

            file.selection = features;

            if (features !== null && features.length > 0) {
                file.displayFeaturesList(features);
            }
        });

        // KML
        window.app.kml.forEach(file => {
            const features = file.getFeatureInfo(event.coordinate);

            file.selection = features;

            if (features !== null && features.length > 0) {
                file.displayFeaturesList(features);
            }
        });

        // WMS
        window.app.wms.forEach(service => {
            if (service.olLayer !== null) {
                service.getFeatureInfo(event.coordinate);
            }
        });

        // WMTS
        window.app.wmts.forEach(service => {
            const getfeatureinfo = typeof service.capabilities.OperationsMetadata.GetFeatureInfo !== 'undefined';

            if (getfeatureinfo === true && Object.keys(service.olLayers).length > 0) {
                service.getFeatureInfo(event.coordinate);
            }
        });
    });
}
