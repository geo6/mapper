import Draw from 'ol/interaction/Draw';

class DrawPoint extends Draw {
    constructor() {
        super({
            source: window.app.draw.layer.getSource(),
            type: 'Point'
        });

        this.on('drawend', (event) => {
            const count = parseInt($('#draw-count-point').text());

            $('#draw-count-point').text(count + 1);

            $('#draw button.list-group-item-action[data-type="point"]').removeClass('active');

            window.app.draw.type = null;
            window.app.draw.disable();
        });
    }
}

export {
    DrawPoint
    as
    default
};
