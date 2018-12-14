'use strict';

import WMTSGetCapabilities from './class/capabilities';
import WMTSGetFeatureInfo from './class/featureinfo';
import WMTSDisplayFeatureList from './class/featurelist';
import generateLayersList from './class/list';
import WMTSAddLayersToMap from './class/map';
import WMTSAddLayerToSidebar from './class/sidebar';

import {
    createUlService
} from '../../info/list/service';

/**
 *
 */
class WMTS {
    /**
     *
     * @param {String} url        WMTS service url.
     * @param {Function} callback Callback called after GetCapabilities().
     */
    constructor (url, callback) {
        this.url = url;
        this.capabilities = null;
        this.layers = null;
        this.olLayers = {};
        this.selection = [];

        this.getCapabilities(callback);

        window.app.wmts.push(this);
    }

    /**
     * @returns {Number} WMTS service index in `window.app.wmts` array.
     */
    getIndex () {
        return window.app.wmts.indexOf(this);
    }

    /**
     *
     * @param {Function} callback Callback called after GetCapabilities().
     *
     * @returns {void}
     */
    getCapabilities (callback) {
        let that = this;

        const getCapabilities = WMTSGetCapabilities(this.url);
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
            .text(this.capabilities.ServiceIdentification.Title)
            .attr('value', `wmts:${index}`)
            .data({
                index: index,
                target: `#modal-layers-wmts-${index}`
            })
            .appendTo('#modal-layers-wmts');

        $('#modal-layers-wmts').show();

        let div = document.createElement('div');

        $(document.createElement('strong'))
            .text(this.capabilities.ServiceIdentification.Title)
            .appendTo(div);
        $(document.createElement('p'))
            .addClass('text-info small')
            .text(this.capabilities.ServiceIdentification.Abstract)
            .appendTo(div);
        $(div)
            .append(generateLayersList(index, this.layers))
            .attr('id', `modal-layers-wmts-${index}`)
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
            'wmts',
            this.getIndex(),
            this.capabilities.ServiceIdentification.Title
        );

        const requests = WMTSGetFeatureInfo(this, coordinate);
        Promise.all(requests)
            .then(responses => {
                $(`#info-service-wmts-${this.getIndex()} > .loading`).remove();

                this.selection = responses;

                responses.forEach(response => {
                    if (response.features.length > 0) {
                        WMTSDisplayFeatureList(this, response.layer, response.features);
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
            return layersName.indexOf(layer.Identifier) > -1;
        });

        WMTSAddLayersToMap(this, layers);
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
                return layerName === layer.Identifier;
            })[0];

            WMTSAddLayerToSidebar(this, layer);
        });
    }

    /**
     *
     * @param {String} layerName Name of the layer to remove.
     *
     * @returns {void}
     */
    removeLayer (layerName) {
        if (this.olLayers[layerName] !== 'undefined') {
            window.app.map.removeLayer(this.olLayers[layerName]);
            delete this.olLayers[layerName];
        }
    }
}

export {
    WMTS
    as
    default
};
