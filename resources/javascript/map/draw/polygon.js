'use strict';

import GeoJSON from 'ol/format/GeoJSON';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Draw from 'ol/interaction/Draw';
import unkinkPolygon from '@turf/unkink-polygon';

class DrawPolygon extends Draw {
    constructor () {
        super({
            source: window.app.draw.layerCurrent.getSource(),
            stopClick: true,
            type: 'Polygon'
        });

        this.on('drawend', (event) => {
            this.validate(event.feature);

            window.app.draw.showForm();
        });
    }

    validate (feature) {
        const geojson = (new GeoJSON()).writeFeature(feature, {
            dataProjection: 'EPSG:4326',
            decimals: 6,
            featureProjection: window.app.map.getView().getProjection()
        });

        const valid = unkinkPolygon(JSON.parse(geojson));

        const features = (new GeoJSON()).readFeatures(valid, {
            dataProjection: 'EPSG:4326',
            featureProjection: window.app.map.getView().getProjection()
        });

        if (features.length > 1) {
            const coordinates = features.map(feature => feature.getGeometry().getCoordinates());

            feature.setGeometry(new MultiPolygon(coordinates));
        }

        return feature;
    }
}

export { DrawPolygon as default };
