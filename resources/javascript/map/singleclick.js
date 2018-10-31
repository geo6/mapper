import {
    getFeatureInfo as WMSGetFeatureInfo,
} from './layers/wms';
import {
    displayFeatureInfo,
    displayLocationInfo
} from '../info';

export default function () {
    window.app.map.on('singleclick', (event) => {
        displayLocationInfo(event.coordinate);

        $('#info-list').empty();

        // WMS
        window.app.wms.forEach((service) => {
            if (service.olLayer !== null) {
                $('#info-loading').show();

                let fetch = WMSGetFeatureInfo(service, event.coordinate);
                if (fetch !== null) {
                    fetch.then((results) => {
                        results.forEach((result) => {
                            service.selection = result.features;

                            result.features.forEach((feature, index) => displayFeatureInfo(service, result.layerName, feature, index));
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
