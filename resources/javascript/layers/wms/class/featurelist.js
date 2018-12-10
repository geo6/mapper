import displayFeatureInList from '../../../info/feature';
import {
    createOlLayer
} from '../../../info/list/service';

/**
 * Generate list with the result of GetFeatureInfo request on a WMS service for each queried layers in the sidebar.
 *
 * @param {object} service   WMS service object.
 * @param {string} layerName Name of the layer.
 * @param {object} feature   Feature to display.
 * @param {int} featureIndex Index of the feature (in result) to display.
 *
 * @returns {void}
 */
export default function (service, layerName, feature, featureIndex) {
    const serviceTitle = service.capabilities.Service.Title;

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);
    const layerTitle = service.layers[layerIndex].Title;

    const olLayer = createOlLayer('wms', service.getIndex(), layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    displayFeatureInList(feature, featureIndex, title, olLayer, service.selection);
}
