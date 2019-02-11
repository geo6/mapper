'use strict';

class Cache {
    constructor () {
        if (window.app.custom !== null) {
            this.storageKey = `mapper.${window.app.custom}.cache`;
        } else {
            this.storageKey = 'mapper.cache';
        }

        const storage = localStorage.getItem(this.storageKey);
        if (storage !== null) {
            $.extend(this, JSON.parse(storage));
        }
    }

    setBaselayer (name) {
        this.baselayer = name;
        this.save();
    }

    setMap (zoom, longitude, latitude) {
        this.map = {
            latitude: latitude,
            longitude: longitude,
            zoom: zoom
        };
        this.save();
    }

    save () {
        localStorage.setItem(this.storageKey, JSON.stringify({
            baselayer: this.baselayer || null,
            map: this.map || null
        }));
    }
}

export { Cache as default };
