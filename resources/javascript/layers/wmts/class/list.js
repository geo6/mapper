function generateLayersList (service, layers) {
    let ul = document.createElement('ul');

    $(ul).addClass('list-group mb-3');

    for (let i = 0; i < layers.length; i++) {
        let queryable = false;
        if (typeof layers[i].ResourceURL !== 'undefined') {
            layers[i].ResourceURL.forEach((resource) => {
                if (resource.resourceType === 'FeatureInfo' && resource.format === 'application/json') {
                    queryable = true;

                    return false;
                }
            });
        }

        let li = document.createElement('li');
        let div = document.createElement('div');
        let badge = $(document.createElement('span')).addClass('badge badge-light ml-1');

        $(li)
            .attr('id', `wmts-${service.getIndex()}-${layers[i].Identifier}`)
            .data({
                name: layers[i].Identifier
            })
            .addClass('list-group-item')
            .on('click', (event) => {
                event.stopPropagation();

                $(event.delegateTarget).toggleClass('list-group-item-primary');
            })
            .appendTo(ul);

        let icon = '';
        if (typeof service.capabilities.OperationsMetadata.GetFeatureInfo !== 'undefined' && queryable === true) {
            if (service.mixedContent === true) {
                icon = '<i class="fas fa-info-circle text-light" style="cursor:help;" title="GetFeatureInfo is disabled because of Mixed Active Content."></i> ';
            } else {
                icon = '<i class="fas fa-info-circle"></i> ';
            }
        }

        $(div)
            .append([
                icon,
                layers[i].Title,
                $(badge).text(layers[i].Identifier)
            ])
            .appendTo(li);

        if (typeof layers[i].Abstract !== 'undefined' && layers[i].Abstract !== '') {
            let p = document.createElement('p');

            $(p)
                .addClass('text-info small')
                .html(layers[i].Abstract.replace(/(\r\n|\n\r|\r|\n)/g, '<br>' + '$1'))
                .appendTo(li);
        }

        /* if (typeof layers[i].Layer !== 'undefined') {
            $(li).append(generateLayersList(service.getIndex(), layers[i].Layer));
        } */
    }

    return ul;
}

export default generateLayersList;
