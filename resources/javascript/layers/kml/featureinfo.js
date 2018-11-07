export default function (file, coordinate) {
    const pixel = window.app.map.getPixelFromCoordinate(coordinate);

    if (file.olLayer === null) {
        return [];
    }

    return window.app.map.getFeaturesAtPixel(pixel, {
        // hitTolerance: 10,
        layerFilter: (layer) => {
            return layer === file.olLayer;
        }
    });
}
