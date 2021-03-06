"use strict";

import Control, { Options } from "ol/control/Control";
import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

class GeolocationControl extends Control {
  private active: boolean;

  private features: {
    accuracy: Feature;
    position: Feature;
  };

  private geolocation: Geolocation;

  private layer: VectorLayer;

  private isRecentered: boolean;

  constructor(options?: Options) {
    const button = document.createElement("button");
    button.innerHTML = '<i class="fas fa-fw fa-location-arrow"></i>';
    button.title = "Show my location";

    const element = document.createElement("div");
    element.className = "ol-geolocation ol-unselectable ol-control";
    element.appendChild(button);

    super(
      Object.assign(options || {}, {
        element: element,
      })
    );

    button.addEventListener("click", this.handleGeolocation.bind(this), false);

    this.active = false;
    this.isRecentered = false;

    this.features = {
      accuracy: new Feature(),
      position: new Feature(),
    };

    this.layer = new VectorLayer({
      source: new VectorSource({
        features: [this.features.accuracy, this.features.position],
      }),
    });

    this.initGeolocation();
  }

  handleGeolocation(): void {
    this.active = !this.active;

    this.geolocation.setTracking(this.active);

    if (this.active === true) {
      this.getMap().addLayer(this.layer);
    } else {
      this.isRecentered = false;
      this.features.accuracy.setGeometry(null);
      this.features.position.setGeometry(null);
      this.getMap().removeLayer(this.layer);
    }
  }

  initGeolocation(): void {
    this.geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: "EPSG:3857",
    });
    this.geolocation.on("change:accuracyGeometry", () => {
      this.features.accuracy.setGeometry(
        this.geolocation.getAccuracyGeometry()
      );

      if (this.isRecentered === false) {
        this.getMap()
          .getView()
          .fit(this.features.accuracy.getGeometry().getExtent(), {
            maxZoom: 18,
            padding: [15, 15, 15, 15],
          });

        this.isRecentered = true;
      }
    });
    this.geolocation.on("change:position", () => {
      const coordinates = this.geolocation.getPosition();

      this.features.position.setGeometry(
        coordinates ? new Point(coordinates) : null
      );
    });
    this.geolocation.on("error", (error) => {
      console.error(error.message);
    });
  }
}

export { GeolocationControl as default };
