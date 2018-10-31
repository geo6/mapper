export default function () {
    $('#infos-list-btn-back').on('click', () => {
        $('#info-details').hide();
        $('#info-list').show();
    });

    $('#infos-list-btn-prev').on('click', () => {
        let items = $('#info-list ol > li');
        let { current } = $('#info-details').data();

        if (current - 1 >= 0) {
            $(`#info-list ol > li:eq(${current - 1})`).trigger('click');
        }
    });
    $('#infos-list-btn-next').on('click', () => {
        let items = $('#info-list ol > li');
        let { current } = $('#info-details').data();

        if (current + 1 < items.length) {
            $(`#info-list ol > li:eq(${current + 1})`).trigger('click');
        }
    });
}
