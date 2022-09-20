import * as itowns from 'itowns';

// Creating a view
var viewerDiv = document.getElementById('viewerDiv');
var placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.35, 48.8),
    range: 25e6
};
var view = new itowns.GlobeView(viewerDiv, placement);

// Adding a color layer
var orthoSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'ORTHOIMAGERY.ORTHOPHOTOS',
    tileMatrixSet: 'PM',
    format: 'image/jpeg',
});
var orthoLayer = new itowns.ColorLayer('Ortho', {
    source: orthoSource,
});
view.addLayer(orthoLayer);

// Adding an elevation layer
var elevationSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:4326',
    name: 'ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3',
    tileMatrixSet: 'WGS84G',
    format: 'image/x-bil;bits=32',
    zoom: {min: 3, max: 10}
});
var elevationLayer = new itowns.ElevationLayer('MNT_WORLD', {
    source: elevationSource,
});
view.addLayer(elevationLayer);

