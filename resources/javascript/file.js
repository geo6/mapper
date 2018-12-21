'use strict';

/**
 *
 */
class File {
    /**
     *
     * @param {String} type File type (geojson|gpx|kml).
     * @param {String} identifier File unique identifier.
     * @param {String} name File name.
     * @param {String} title File title.
     * @param {String} description File description.
     */
    constructor (type, identifier, name, title, description) {
        this.type = type;
        this.identifier = identifier;
        this.name = name;
        this.title = title;
        this.description = description;
        this.olLayer = null;
        this.selection = [];

        if (['geojson', 'gpx', 'kml'].indexOf(this.type) === -1) {
            throw new Error('Invalid file type.');
        }

        window.app[this.type].push(this);
    }

    /**
     * @returns {Number} File index in `window.app[type]` array.
     */
    getIndex () {
        return window.app[this.type].indexOf(this);
    }

    /**
     * @param {} element DOM element to replace (used by upload).
     *
     * @returns {void}
     */
    displayInList (element) {
        const li = document.createElement('li');
        $(li)
            .addClass('list-group-item')
            .attr({
                id: `file-${this.type}-${this.getIndex()}`
            })
            .on('click', event => {
                event.stopPropagation();

                $(event.delegateTarget).toggleClass('list-group-item-primary');
            });

        $(document.createElement('div'))
            .append(`<strong>${this.name}</strong>`)
            .appendTo(li);

        if (typeof this.title !== 'undefined') {
            $(document.createElement('div'))
                .text(this.title)
                .appendTo(li);
        }
        if (typeof this.description !== 'undefined') {
            $(document.createElement('p'))
                .addClass('text-info small')
                .text(this.description)
                .appendTo(li);
        }

        if (typeof element !== 'undefined' && $(element).length > 0) {
            $(element).replaceWith(li);
        } else {
            $(`#modal-layers-files-${this.type} > .list-group`).append(li);
        }
    }
}

export {
    File
    as
    default
};
