import displayDetails from './details';

export default function (feature, featureIndex, title, olElement, selection) {
    let id = feature.getId();
    let properties = feature.getProperties();
    let geometryName = feature.getGeometryName();
    let geometry = feature.getGeometry();

    delete properties[geometryName];

    let label = geometry !== null ? '<i class="fas fa-vector-square"></i> ' : '';

    if (typeof id !== 'undefined') {
        label += id;
    } else {
        for (const prop in properties) {
            if (typeof properties[prop] === 'number' || typeof properties[prop] === 'string') {
                label += `<em>${prop}</em>: ${properties[prop]}`;

                break;
            }
        }
    }

    let li = document.createElement('li');

    $(li)
        .append(label)
        .appendTo(olElement)
        .data({
            featureIndex
        })
        .on('click', event => {
            let li = event.currentTarget;
            let {
                featureIndex
            } = $(li).data();
            let feature = selection[featureIndex];

            displayDetails(title, feature, li);

            window.app.marker.setGeometry(feature.getGeometry());
            window.app.markerLayer.setVisible(true);
        });
}
