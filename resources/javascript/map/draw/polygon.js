import Draw from 'ol/interaction/Draw';

class DrawPolygon extends Draw {
    constructor () {
        super({
            source: window.app.draw.layer.getSource(),
            type: 'Polygon'
        });

        this.on('drawend', (event) => {
            const count = parseInt($('#draw-count-polygon').text());

            $('#draw-count-polygon').text(count + 1);
        });
    }
}

export {
    DrawPolygon
    as
    default
};
