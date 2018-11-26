import displayFeatureInList from '../../feature';
import {
    createOlLayer
} from '../service';

/**
 * Generate list with the result of GetFeatureInfo request on a WMTS service for each queried layers in the sidebar.
 *
 * @param {object} service   WMTS service object.
 * @param {string} layerName Name of the layer.
 * @param {object} feature   Feature to display.
 * @param {int} featureIndex Index of the feature (in result) to display.
 *
 * @returns {void}
 */
export default function (service, layerName, feature, featureIndex) {
    const serviceIndex = window.app.wmts.indexOf(service);
    const serviceType = 'wmts';
    const serviceTitle = service.capabilities.ServiceIdentification.Title;

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);
    const layerTitle = service.layers[layerIndex].Title;

    $(`#info-service-${serviceType}-${serviceIndex} > .loading`).remove();

    const olLayer = createOlLayer(serviceType, serviceIndex, layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    displayFeatureInList(feature, featureIndex, title, olLayer, service.selection);
}
