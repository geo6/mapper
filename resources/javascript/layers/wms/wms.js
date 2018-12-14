'use strict';

import WMSGetCapabilities from './class/capabilities';
import WMSGetFeatureInfo from './class/featureinfo';
import WMSDisplayFeatureList from './class/featurelist';
import generateLayersList from './class/list';
import WMSAddLayersToMap from './class/map';
import WMSAddLayerToSidebar from './class/sidebar';

import {
    createUlService
} from '../../info/list/service';

/**
 *
 */
class WMS {
    /**
     *
     * @param {String} url        WMS service url.
     * @param {Function} callback Callback called after GetCapabilities().
     */
    constructor (url, callback) {
        this.url = url;
        this.capabilities = null;
        this.layers = null;
        this.olLayer = null;
        this.selection = [];

        this.getCapabilities(callback);

        window.app.wms.push(this);
    }

    /**
     * @returns {Number} WMS service index in `window.app.wms` array.
     */
    getIndex () {
        return window.app.wms.indexOf(this);
    }

    /**
     *
     * @param {Function} callback Callback called after GetCapabilities().
     *
     * @returns {void}
     */
    getCapabilities (callback) {
        let that = this;

        const getCapabilities = WMSGetCapabilities(this.url);
        if (getCapabilities instanceof Promise) {
            getCapabilities
                .then(response => {
                    that.capabilities = response.capabilities;
                    that.layers = response.layers;

                    callback.call(this, this);
                });
        }
    }

    /**
     * @returns {void}
     */
    displayCapabilities () {
        const index = this.getIndex();

        $(document.createElement('option'))
            .text(this.capabilities.Service.Title)
            .attr('value', `wms:${index}`)
            .data({
                index: index,
                target: `#modal-layers-wms-${index}`
            })
            .appendTo('#modal-layers-optgroup-wms');

        $('#modal-layers-optgroup-wms').show();

        let div = document.createElement('div');

        $(document.createElement('strong'))
            .text(this.capabilities.Service.Title)
            .appendTo(div);
        $(document.createElement('p'))
            .addClass('text-info small')
            .text(this.capabilities.Service.Abstract)
            .appendTo(div);
        $(div)
            .append(generateLayersList(index, this.layers))
            .attr('id', `modal-layers-wms-${index}`)
            .hide();

        $('#modal-layers-layers').append(div);
    }

    /**
     *
     * @param {Number[]} coordinate Coordinate.
     *
     * @returns {void}
     */
    getFeatureInfo (coordinate) {
        createUlService(
            'wms',
            this.getIndex(),
            this.capabilities.Service.Title
        );

        const requests = WMSGetFeatureInfo(this, coordinate);
        Promise.all(requests)
            .then(responses => {
                $(`#info-service-wms-${this.getIndex()} > .loading`).remove();

                this.selection = responses;

                responses.forEach(response => {
                    if (response.features.length > 0) {
                        WMSDisplayFeatureList(this, response.layer, response.features);
                    }
                });
            });
    }

    /**
     *
     * @param {String[]} layersName Names of the layers to add to the map.
     *
     * @returns {void}
     */
    addToMap (layersName) {
        const layers = this.layers.filter(layer => {
            return layersName.indexOf(layer.Name) > -1;
        });

        WMSAddLayersToMap(this, layers);
    }

    /**
     *
     * @param {String[]} layersName Names of the layers to add to the sidebar.
     *
     * @returns {void}
     */
    addToSidebar (layersName) {
        layersName.forEach(layerName => {
            const layer = this.layers.filter(layer => {
                return layerName === layer.Name;
            })[0];

            WMSAddLayerToSidebar(this, layer);
        });
    }

    /**
     *
     * @param {String} layerName Name of the layer to remove.
     *
     * @returns {void}
     */
    removeLayer (layerName) {
        let layers = this.olLayer.getSource().getParams().LAYERS;
        const index = layers.indexOf(layerName);

        if (index > -1) {
            layers.splice(index, 1);

            if (layers.length > 0) {
                this.olLayer.getSource().updateParams({
                    'LAYERS': layers
                });
            } else {
                window.app.map.removeLayer(this.olLayer);
                this.olLayer = null;
            }
        }
    }
}

export {
    WMS
    as
    default
};
