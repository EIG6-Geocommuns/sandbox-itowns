// # Simple Globe viewer
/* global itowns, setupLoadingScreen, GuiTools, ToolTip */

import * as itowns from 'itowns';
import * as GuiTools from './GUI/GuiTools';
import proj4 from 'proj4';

function main() {
    // Define crs projection that we will use (taken from https://epsg.io/3946,
    // Proj4js section)
    itowns.CRS.defs('EPSG:3946',
        '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 ' +
        '+x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 ' +
        '+units=m +no_defs');


    const extent = new itowns.Extent(
        'EPSG:3946',
        -20037508.342789244, 20037508.342789244,
        -20037508.342789255, 20037508.342789244);


    // `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
    var viewerDiv = document.getElementById('viewerDiv');

    // Instanciate iTowns GlobeView*
    var view = new itowns.PlanarView(viewerDiv, extent);

    // Display the content of two GeoJSON files on terrain with ColorLayer and FileSource.
    // The GeoJSONs are loaded from url, set in FileSource

    // Declare the source for the data on Ariege area
    const ariegeSource = new itowns.FileSource({
        url: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/09-ariege/departement-09-ariege.geojson',
        crs: 'EPSG:4326',
        format: 'application/json',
    });
    // Create a ColorLayer for the Ariege area
    const ariegeLayer = new itowns.ColorLayer('ariege', {
        name: 'ariege',
        transparent: true,
        source: ariegeSource,
        style: new itowns.Style({
            fill: {
                color: 'orange',
                opacity: 0.5,
            },
            stroke: {
                color: 'white',
            },
        }),
    });
    // Add the Ariege ColorLayer to the view and grant it a tooltip
    view.addLayer(ariegeLayer)//.then(FeatureToolTip.addLayer);


    // Declare the source for the data on Pyrenees Orientales area
    const pyoSource = new itowns.FileSource({
        url: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/66-pyrenees-orientales/departement-66-pyrenees-orientales.geojson',
        crs: 'EPSG:4326',
        format: 'application/json',
    });
    // Create a ColorLayer for the Pyrenees Orientales area
    const pyoLayer = new itowns.ColorLayer('pyrenees-orientales', {
        name: 'pyrenees-orientales',
        transparent: true,
        source: pyoSource,
        style: new itowns.Style({
            fill: {
                opacity: 0.8,
            },
            stroke: {
                color:'IndianRed',
            },
        }),
    });
    // Add The Pyrennees Orientales ColorLayer to the view and grant it a tooltip
    view.addLayer(pyoLayer)//.then(FeatureToolTip.addLayer);


    // Center the camera on the data extents
    view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
        const layersExtent = ariegeSource.extent.clone();
        layersExtent.union(pyoSource.extent);
    });


//    debug.createTileDebugUI(menuGlobe.gui, view);
}

export default {
    main
}
