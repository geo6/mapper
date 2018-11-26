import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

export default function (wms, layers) {
    if (typeof wms !== 'undefined' && layers.length > 0) {
        let service = wms.capabilities;

        let names = [];
        for (let i = 0; i < layers.length; i++) {
            names.push(layers[i].Name);
        }

        if (wms.olLayer === null) {
            wms.olLayer = new TileLayer({
                source: new TileWMS({
                    params: {
                        'LAYERS': names
                    },
                    url: service.Service.OnlineResource
                })
            });

            window.app.map.addLayer(wms.olLayer);
        } else {
            let params = wms.olLayer.getSource().getParams();
            wms.olLayer.getSource().updateParams({
                'LAYERS': params.LAYERS.concat(names)
            });
        }

        /*
                let extent = null;

                // To Do: Get extent for each layer if available and compute extent

                if (extent === null && typeof service.Capability.Layer.BoundingBox !== 'undefined') {
                    for (let i = 0; i < service.Capability.Layer.BoundingBox.length; i++) {
                        let bbox = service.Capability.Layer.BoundingBox[i];

                        if (bbox.crs === 'EPSG:3857') {
                            extent = bbox.extent;
                            break;
                        } else if (bbox.crs === 'EPSG:4326') {
                            let min = fromLonLat([bbox.extent[0], bbox.extent[1]]);
                            let max = fromLonLat([bbox.extent[2], bbox.extent[3]]);

                            extent = [
                                min[0],
                                min[1],
                                max[0],
                                max[1]
                            ];
                            break;
                        }
                    }
                }

                if (extent !== null) {
                    window.app.map.getView().fit(extent, {
                        maxZoom: 18,
                        padding: [15, 15, 15, 15]
                    })
                }
        */
    }
}
