"use strict";

export class Cache {
  baselayer: string;
  map: { latitude: number; longitude: number; zoom: number };
  storageKey: string;

  constructor() {
    if (window.app.custom !== null) {
      this.storageKey = `mapper.${window.app.custom}.cache`;
    } else {
      this.storageKey = "mapper.cache";
    }

    const storage = localStorage.getItem(this.storageKey);
    if (storage !== null) {
      $.extend(this, JSON.parse(storage));
    }
  }

  setBaselayer(name: string) {
    this.baselayer = name;
    this.save();
  }

  setMap(zoom: number, longitude: number, latitude: number) {
    this.map = {
      latitude: latitude,
      longitude: longitude,
      zoom: zoom,
    };
    this.save();
  }

  save() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        baselayer: this.baselayer || null,
        map: this.map || null,
      })
    );
  }
}
