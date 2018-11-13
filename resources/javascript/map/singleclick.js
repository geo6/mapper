import GeoJSONGetFeatureInfo from '../layers/geojson/featureinfo';
import GPXGetFeatureInfo from '../layers/gpx/featureinfo';
import KMLGetFeatureInfo from '../layers/kml/featureinfo';
import WMSGetFeatureInfo from '../layers/wms/featureinfo';

import displayFileFeatureInfoList from '../info/list/file';
import displayWMSFeatureInfoList from '../info/list/wms';
import displayLocation from '../info/location';

export default function () {
    window.app.map.on('singleclick', (event) => {
        window.app.marker.setGeometry(null);

        displayLocation(event.coordinate);

        $('#info-list').empty().show();
        $('#info-details').hide();
        $('#info-details > table > caption, #info-details > table > tbody').empty();
        $('#info-details-geometry').empty().hide();

        $('#infos-list-btn-prev, #infos-list-btn-next').prop('disabled', true);
        $('#infos-details-btn-locate').off().prop('disabled', true);

        // GeoJSON
        window.app.geojson.forEach((file) => {
            const features = GeoJSONGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
        });

        // GPX
        window.app.gpx.forEach((file) => {
            const features = GPXGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
        });

        // KML
        window.app.kml.forEach((file) => {
            const features = KMLGetFeatureInfo(file, event.coordinate);

            file.selection = features;

            features.forEach((feature, index) => displayFileFeatureInfoList(file, feature, index));
        });

        // WMS
        window.app.wms.forEach((service) => {
            if (service.olLayer !== null) {
                $('#info-loading').show();

                let fetch = WMSGetFeatureInfo(service, event.coordinate);
                if (fetch !== null) {
                    fetch.then((results) => {
                        results.forEach((result) => {
                            service.selection = result.features;

                            result.features.forEach((feature, index) => displayWMSFeatureInfoList(service, result.layerName, feature, index));
                        });

                        $('#info-loading').hide();
                    });
                }
            }
        });

        // WMTS
        window.app.wmts.forEach((service) => {
            // console.log(service);
        });
    });
}
