"use strict";

export default function(index) {
  const names = [];

  $(`#modal-layers-wms-${index} .list-group-item.list-group-item-primary`).each((index, element) => {
    const { name } = $(element).data();

    names.push(name);

    $(element).removeClass("list-group-item-primary");
  });

  if (names.length > 0) {
    window.app.wms[index].addToMap(names);
    window.app.wms[index].addToSidebar(names);
  }
}
