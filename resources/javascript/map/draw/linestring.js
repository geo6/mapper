import Draw from 'ol/interaction/Draw';

class DrawLineString extends Draw {
    constructor() {
        super({
            source: window.app.draw.layer.getSource(),
            type: 'LineString'
        });

        this.on('drawend', (event) => {
            const count = parseInt($('#draw-count-linestring').text());

            $('#draw-count-linestring').text(count + 1);

            $('#draw button.list-group-item-action[data-type="linestring"]').removeClass('active');

            window.app.draw.type = null;
            window.app.draw.disable();
        });
    }
}

export {
    DrawLineString
    as
    default
};
