import * as itowns from 'itowns';

// Creating a view
let viewerDiv = document.getElementById('viewerDiv');
let placement = {
    coord: new itowns.Coordinates('EPSG:4326', 4.818, 45.7354),
    range: 1000,
    tilt: 20
};
let view = new itowns.GlobeView(viewerDiv, placement);

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
    name: 'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
    tileMatrixSet: 'WGS84G',
    format: 'image/x-bil;bits=32',
    tileMatrixSetLimits: {
        11: {
            minTileRow: 442,
            maxTileRow: 1267,
            minTileCol: 1344,
            maxTileCol: 2683
        },
        12: {
            minTileRow: 885,
            maxTileRow: 2343,
            minTileCol: 3978,
            maxTileCol: 5126
        },
        13: {
            minTileRow: 1770,
            maxTileRow: 4687,
            minTileCol: 7957,
            maxTileCol: 10253
        },
        14: {
            minTileRow: 3540,
            maxTileRow: 9375,
            minTileCol: 15914,
            maxTileCol: 20507
        }
    }
});
var elevationLayer = new itowns.ElevationLayer('MNT_WORLD', {
    source: elevationSource,
});
view.addLayer(elevationLayer);

// Adding a GeometryLayer
var geometrySource = new itowns.WFSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    crs: 'EPSG:4326',
});
var geometryLayer = new itowns.FeatureGeometryLayer('Buildings', {
    source: geometrySource,
    zoom: { min: 14 },
});
view.addLayer(geometryLayer);
