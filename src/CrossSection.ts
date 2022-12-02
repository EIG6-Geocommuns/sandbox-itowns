import * as THREE from 'three';
import * as itowns from 'itowns';

const crs = 'EPSG:4326';

const orthoSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'ORTHOIMAGERY.ORTHOPHOTOS',
    tileMatrixSet: 'PM',
    format: 'image/jpeg',
});

// MNT mondial SRTM3
const worldDTMSource = new itowns.WMTSSource({
    url: "https://wxs.ign.fr/altimetrie/geoportail/wmts",
    crs: "EPSG:4326",
    format: "image/x-bil;bits=32",
    name: "ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3",
    tileMatrixSet: "WGS84G"
});

// MNT RGE Alti
const ignDTMSource = new itowns.WMTSSource({
    url: "https://wxs.ign.fr/altimetrie/geoportail/wmts",
    crs: "EPSG:4326",
    format: "image/x-bil;bits=32",
    name: "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES",
    tileMatrixSet: "WGS84G"
});

function onClick(this: GlobalEventHandlers, ev: MouseEvent) {
}

function main() {
    const coords = new itowns.Coordinates(crs, 2.351323, 48.856712);
    const placement = { coord: coords, range: 4000, tilt: 50 };

    const viewerDiv = document.getElementById('viewerDiv') as HTMLDivElement;
    const view: itowns.GlobeView = new itowns.GlobeView(viewerDiv, placement);

    view.addLayer(new itowns.ColorLayer('ORTHO', { source: orthoSource }));
    const worldDTMLayer = new itowns.ElevationLayer('WORLD_DTM', {
        source: worldDTMSource
    });
    const ignDTMLayer: any = new itowns.ElevationLayer('IGN_DTM', {
        source: ignDTMSource
    });
    view.addLayer(ignDTMLayer);

    if (viewerDiv != undefined) {
        viewerDiv.addEventListener('click', function (e: MouseEvent) {
            // console.log(ignDTMLayer);
            // console.log(ignDTMLayer.zoom);
            // console.log(view.camera);

            const cursorWorldPosition: THREE.Vector3 = new THREE.Vector3();
            const coordinatesView = new itowns.Coordinates(view.referenceCrs);
            const coordinates4326 = new itowns.Coordinates('EPSG:4326');

            const viewCoords = view.eventToViewCoords(e)!;

            if (view.getPickingPositionFromDepth(viewCoords, cursorWorldPosition)) {
                coordinatesView.setFromVector3(cursorWorldPosition).as('EPSG:4326', coordinates4326);

                const elevation = itowns.DEMUtils.getElevationValueAt(
                    view.tileLayer,
                    coordinates4326
                );
                //console.log(viewCoords);
                //console.log(cursorWorldPosition);
                //console.log(coordinatesView);
                console.log(coordinates4326);
                console.log(elevation);
            }


            if (viewCoords) {
                const { x, y } = viewCoords;
                const coords2 = new itowns.Coordinates(crs, x, y, 0).as(crs);

                const elevation = itowns.DEMUtils.getElevationValueAt(
                    view.tileLayer,
                    coords2
                );
                console.log('elevation: ' + elevation);

                ignDTMLayer.getData(10, 10);
            }
        });
    }
}

export default {
    main
}
