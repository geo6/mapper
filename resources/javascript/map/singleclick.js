import GeoJSONGetFeatureInfo from '../layers/geojson/featureinfo';
import GPXGetFeatureInfo from '../layers/gpx/featureinfo';
import KMLGetFeatureInfo from '../layers/kml/featureinfo';

import MeasureControl from './measure';

import displayFileFeatureInfoList from '../info/list/file';
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

        // GeoJSON
        window.app.geojson.forEach(file => {
            const features = GeoJSONGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
        });

        // GPX
        window.app.gpx.forEach(file => {
            const features = GPXGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
        });

        // KML
        window.app.kml.forEach(file => {
            const features = KMLGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
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
