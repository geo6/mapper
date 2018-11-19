import DrawControl from './map/draw';

export default function () {
    window.app.draw = new DrawControl();

    $('#sidebar a[href="#draw"]').on('click', () => {
        window.app.draw.active = !$('#sidebar').hasClass('collapsed');

        if (window.app.draw.active === false) {
            window.app.draw.disable();
        }
    });

    $('#btn-draw-clear').on('click', () => {
        window.app.draw.clear();
        $('.draw-count').text(0);
    });
    $('#draw button.list-group-item-action').on('click', (event) => {
        const { type } = $(event.currentTarget).data();

        $(event.currentTarget).addClass('active');

        if (window.app.draw.type !== null) {
            window.app.draw.disable();
        }

        window.app.draw.type = type;
        window.app.draw.enable();
    });
}
