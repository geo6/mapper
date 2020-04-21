'use strict';

import Feature from 'ol/Feature';
import WKT from 'ol/format/WKT';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import VectorSource from 'ol/source/Vector';

import Papa from 'papaparse';

import layerStyleFunction from '../../map/style';

export default function (file, projection) {
    Papa.parse(file.url, {
        dynamicTyping: true,
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.errors.length > 0) {
                let errors = '';
                for (let i = 0; i < results.errors.length; i++) {
                    errors += '\r\n' + results.errors[i].message;
                }
                throw new Error(errors);
            }

            let xColumn = null;
            let yColumn = null;
            let wktColumn = null;

            results.meta.fields.forEach((column) => {
                if (['lon', 'lng', 'longitude', 'x'].indexOf(column.toLowerCase()) > -1) {
                    xColumn = column;
                }
                if (['lat', 'latitude', 'y'].indexOf(column.toLowerCase()) > -1) {
                    yColumn = column;
                }
                if (column.toLowerCase() === 'wkt') {
                    wktColumn = column;
                }
            });

            if (wktColumn === null && (xColumn === null || yColumn === null)) {
                throw new Error('Geometry column(s) missing (Longitude/Latitude or WKT) !');
            }

            file.olLayer = new VectorLayer({
                source: new VectorSource(),
                style: (feature, resolution) => layerStyleFunction(feature, file.label, resolution)
            });

            results.data.forEach(result => {
                const feature = new Feature(result);

                if (wktColumn !== null) {
                    feature.setGeometry((new WKT()).readGeometry(result[wktColumn], {
                        dataProjection: projection,
                        featureProjection: window.app.map.getView().getProjection()
                    }));
                } else {
                    feature.setGeometry(new Point(transform([result[xColumn], result[yColumn]], projection, window.app.map.getView().getProjection())));
                }

                file.olLayer.getSource().addFeature(feature);
            });

            window.app.map.addLayer(file.olLayer);
        }
    });
}
