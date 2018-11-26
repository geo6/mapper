import displayFeatureInList from '../../feature';
import {
    createOlLayer
} from '../service';

export default function (service, layerName, feature, featureIndex) {
    const serviceIndex = window.app.wms.indexOf(service);
    const serviceType = 'wms';
    const serviceTitle = service.capabilities.Service.Title;

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);
    const layerTitle = service.layers[layerIndex].Title;

    $(`#info-service-${serviceType}-${serviceIndex} > .loading`).remove();

    const olLayer = createOlLayer(serviceType, serviceIndex, layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    displayFeatureInList(feature, featureIndex, title, olLayer, service.selection);
}
