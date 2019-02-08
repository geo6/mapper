'use strict';

import MeasureControl from './measure';
import displayLocation from '../info/location';

export default function () {
    window.app.map.on('singleclick', (event) => {
        let activeControls = window.app.map.getControls().getArray().filter((control) => {
            return (control instanceof MeasureControl && control.active === true);
        });
        if (window.app.draw.active === true) {
            activeControls.push(window.app.draw.active);
        }
        if (activeControls.length > 0) {
            return false;
        }

        window.app.marker.setGeometry(null);

        displayLocation(event.coordinate);

        $('#info-list').empty().show();
        $('#info-details').hide();
        $('#info-details > table > caption, #info-details > table > tbody').empty();
        $('#info-details-geometry').empty().hide();

        $('#infos-list-btn-prev, #infos-list-btn-next').prop('disabled', true);
        $('#infos-details-btn-locate').off().prop('disabled', true);

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
