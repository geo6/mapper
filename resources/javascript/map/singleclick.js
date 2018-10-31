import WMSGetFeatureInfo from '../layers/wms/featureinfo';

import displayFeatureInfoList from '../info/list';
import displayLocation from '../info/location';

export default function () {
    window.app.map.on('singleclick', (event) => {
        displayLocation(event.coordinate);

        $('#info-list').empty().show();
        $('#info-details').hide();
        $('#info-details > table > caption, #info-details > table > tbody').empty();
        $('#info-details-geometry').empty().hide();

        $('#infos-list-btn-prev, #infos-list-btn-next').prop('disabled', true);
        $('#infos-details-btn-locate').off().prop('disabled', true);

        // WMS
        window.app.wms.forEach((service) => {
            if (service.olLayer !== null) {
                $('#info-loading').show();

                let fetch = WMSGetFeatureInfo(service, event.coordinate);
                if (fetch !== null) {
                    fetch.then((results) => {
                        results.forEach((result) => {
                            service.selection = result.features;

                            result.features.forEach((feature, index) => displayFeatureInfoList(service, result.layerName, feature, index));
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
