import displayFeatureInList from '../../feature';
import {
    createUlService,
    createOlLayer
} from '../service';

export default function (service, layerName, feature, featureIndex) {
    const serviceIndex = window.app.wmts.indexOf(service);
    const serviceType = 'wmts';
    const serviceTitle = service.capabilities.ServiceIdentification.Title;

    const layerIndex = service.layers.findIndex(element => element.Name === layerName);
    const layerTitle = service.layers[layerIndex].Title;

    createUlService(serviceType, serviceIndex, serviceTitle);
    const olLayer = createOlLayer(serviceType, serviceIndex, layerIndex, layerTitle);

    const title = `<strong>${serviceTitle}</strong> - ${layerTitle}`;

    displayFeatureInList(feature, featureIndex, title, olLayer, service.selection);
}
