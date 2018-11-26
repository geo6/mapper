function generateLayersList (index, layers) {
    let ul = document.createElement('ul');

    $(ul).addClass('list-group mb-3');

    for (let i = 0; i < layers.length; i++) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        let badge = $(document.createElement('span')).addClass('badge badge-light ml-1');

        $(li)
            .attr('id', `wms-${index}-${layers[i].Name}`)
            .data({
                name: layers[i].Name
            })
            .addClass('list-group-item')
            .on('click', (event) => {
                event.stopPropagation();

                $(event.delegateTarget).toggleClass('list-group-item-primary');
            })
            .appendTo(ul);

        $(div)
            .append([
                (layers[i].queryable === true ? '<i class="fas fa-info-circle"></i> ' : ''),
                layers[i].Title,
                $(badge).text(layers[i].Name)
            ])
            .appendTo(li);

        if (typeof layers[i].Abstract !== 'undefined' && layers[i].Abstract !== '') {
            let p = document.createElement('p');

            $(p)
                .addClass('text-info small')
                .html(layers[i].Abstract.replace(/(\r\n|\n\r|\r|\n)/g, '<br>' + '$1'))
                .appendTo(li);
        }

        if (typeof layers[i].Layer !== 'undefined') {
            $(li).append(generateLayersList(index, layers[i].Layer));
        }
    }

    return ul;
}

export default generateLayersList;
