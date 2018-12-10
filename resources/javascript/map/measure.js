'use strict';

import Control from 'ol/control/Control';
import {
    LineString,
    Polygon
} from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import {
    unByKey
} from 'ol/Observable.js';
import Overlay from 'ol/Overlay';
import VectorSource from 'ol/source/Vector';
import {
    getArea,
    getLength
} from 'ol/sphere.js';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';

class MeasureControl extends Control {
    constructor (optOptions) {
        const options = optOptions || {};

        const buttonDistance = document.createElement('button');
        buttonDistance.innerHTML = '<i class="fas fa-fw fa-ruler"></i>';
        buttonDistance.title = 'Measuring tool: Distance';

        const buttonArea = document.createElement('button');
        buttonArea.innerHTML = '<i class="fas fa-fw fa-draw-polygon"></i>';
        buttonArea.title = 'Measuring tool: Area';

        const element = document.createElement('div');
        element.className = 'ol-measure ol-unselectable ol-control';
        element.appendChild(buttonDistance);
        element.appendChild(buttonArea);

        super({
            element: element,
            target: options.target
        });

        buttonDistance.addEventListener('click', this.handleMeasure.bind(this, 'LineString'), false);
        buttonArea.addEventListener('click', this.handleMeasure.bind(this, 'Polygon'), false);

        this.active = false;

        this.layer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
    }

    /**
     * @returns {void}
     */
    initMeasure () {
        this.draw = new Draw({
            source: this.layer.getSource(),
            type: this.type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });

        let listener;
        this.draw.on('drawstart', (event) => {
            // set sketch
            this.sketch = event.feature;

            /** @type {module:ol/coordinate~Coordinate|undefined} */
            var tooltipCoord = event.coordinate;

            listener = this.sketch.getGeometry().on('change', (event) => {
                var geom = event.target;
                var output;
                if (geom instanceof Polygon) {
                    output = this.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = this.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

        this.draw.on('drawend', () => {
            this.measureTooltipElement.className = 'tooltip tooltip-static';
            this.measureTooltip.setOffset([0, -7]);
            // unset sketch
            this.sketch = null;
            // unset tooltip so that a new one can be created
            this.measureTooltipElement = null;
            unByKey(listener);

            this.getMap().removeOverlay(this.helpTooltip);
            this.getMap().removeInteraction(this.draw);
            this.getMap().un('pointermove', this.pointerMoveHandler);
        }, this);
    }

    /**
     * @param {string} type LineString|Polygon
     *
     * @returns {void}
     */
    handleMeasure (type) {
        this.type = type;
        this.active = !this.active;

        this.layer.getSource().clear();

        if (this.active === true) {
            this.initMeasure();

            this.createHelpTooltip();
            this.createMeasureTooltip();

            this.getMap().addOverlay(this.helpTooltip);
            this.getMap().addOverlay(this.measureTooltip);
            this.getMap().addInteraction(this.draw);
            this.getMap().addLayer(this.layer);

            this.getMap().on('pointermove', this.pointerMoveHandler.bind(this));
            this.getMap().getViewport().addEventListener('mouseout', () => {
                this.helpTooltipElement.classList.add('hidden');
            });
        } else {
            this.getMap().removeOverlay(this.helpTooltip);
            this.getMap().removeOverlay(this.measureTooltip);
            this.getMap().removeInteraction(this.draw);
            this.getMap().removeLayer(this.layer);

            this.getMap().un('pointermove', this.pointerMoveHandler);
            this.getMap().getViewport().removeEventListener('mouseout', () => {
                this.helpTooltipElement.classList.remove('hidden');
            });
        }
    }

    /**
     * Handle pointer move.
     *
     * @param {module:ol/MapBrowserEvent~MapBrowserEvent} event The event.
     *
     * @returns {void}
     */
    pointerMoveHandler (event) {
        if (event.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (this.sketch) {
            var geom = (this.sketch.getGeometry());
            if (geom instanceof Polygon) {
                helpMsg = 'Click to continue drawing the polygon';
            } else if (geom instanceof LineString) {
                helpMsg = 'Click to continue drawing the line';
            }
        }

        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(event.coordinate);

        this.helpTooltipElement.classList.remove('hidden');
    };

    /**
     * Creates a new help tooltip
     *
     * @returns {void}
     */
    createHelpTooltip () {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
    }

    /**
     * Creates a new measure tooltip
     *
     * @returns {void}
     */
    createMeasureTooltip () {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
    }

    /**
     * Format length output.
     *
     * @param {module:ol/geom/LineString~LineString} line The line.
     *
     * @return {string} The formatted length.
     */
    formatLength (line) {
        var length = getLength(line);
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };

    /**
     * Format area output.
     *
     * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
     *
     * @return {string} Formatted area.
     */
    formatArea (polygon) {
        var area = getArea(polygon);
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    };
}

export {
    MeasureControl
    as
    default
};
