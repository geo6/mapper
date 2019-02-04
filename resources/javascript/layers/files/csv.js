import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { fromLonLat } from 'ol/proj';

import Papa from 'papaparse';

export default function (file) {
    Papa.parse(`${window.app.baseUrl}file/${file.identifier}`, {
        dynamicTyping: true,
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.errors.length > 0) {
                let errors = '';
                for (let i = 0; i < results.errors.length; i++) {
                    errors += "\r\n" + results.errors[i].message;
                }
                throw new Error(errors);
            }

            let lngColumn = null;
            let latColumn = null;

            results.meta.fields.forEach((column) => {
                if (['lon', 'lng', 'longitude'].indexOf(column.toLowerCase()) > -1) {
                    lngColumn = column;
                }
                if (['lat', 'latitude'].indexOf(column.toLowerCase()) > -1) {
                    latColumn = column;
                }
            });

            if (lngColumn === null || latColumn === null) {
                throw new Error('Longitude or Latitude column missing !');
            }

            file.olLayer = new VectorLayer({
                source: new VectorSource()
            });

            results.data.forEach(result => {
                const feature = new Feature(result);
                feature.setGeometry(new Point(fromLonLat([result[lngColumn], result[latColumn]])));

                file.olLayer.getSource().addFeature(feature);
            });

            window.app.map.addLayer(file.olLayer);
        }
    });
}
