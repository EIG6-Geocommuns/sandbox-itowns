import * as THREE from 'three';
import * as itowns from 'itowns';
import * as d3 from 'd3';
import { Object3D } from 'three';

const mvtSource = new itowns.VectorTilesSource({
    style: 'https://wxs.ign.fr/essentiels/static/vectorTiles/styles/PLAN.IGN/standard.json',
    filter: (layer: any) => {
        return !layer['source-layer'].includes('oro_') &&
            !layer['source-layer'].includes('parcellaire')
    }
});

const ignSource = new itowns.WMTSSource({
    url: 'https://wxs.ign.fr/cartes/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
    tileMatrixSet: 'PM',
    format: 'image/png'
});

// TODO: Max zoom et min zoom
// TODO: Borne sur les cotes
function main() {
    const extent = new itowns.Extent(
        'EPSG:3857',
        -20037508.34, 20037508.34,
        -20048966.1, 20048966.1
    );

    const placement = new itowns.Extent(
        'EPSG:3857',
        -650631.984763, 1167957.792197, // west, east
        5067754.851372, 3449735.836632  // north, south
    );

    const viewerDiv = document.getElementById('viewerDiv') as HTMLDivElement;

    // Create the view
    var view = new itowns.PlanarView(viewerDiv, extent, {
        camera: { type: itowns.CAMERA_TYPE.ORTHOGRAPHIC },
        controls: {
            // We want to keep the rotation disabled, to only have a view from the top
            enableRotation: false,
            // We do not want the user to zoom out too much
            maxAltitude: 40000000,
            // Prevent from zooming in too much
            // a pixel shall not represent a metric size smaller than 5 mm
            maxResolution: 0.005
        },
        placement: placement,
    });

    const ignLayer = new itowns.ColorLayer('PLANIGN', {
        source: ignSource
    });
    view.addLayer(ignLayer);

    setupSelection(view);
}

function setupSelection(view: itowns.PlanarView) {
    const scene: THREE.Scene = view.scene;
    const camera: THREE.OrthographicCamera = view.camera.camera3D;
    const viewerDiv: HTMLElement = view.domElement;

    const mouse = new THREE.Vector3();
    viewerDiv.addEventListener('mousemove', onMouseMove, false);
    viewerDiv.addEventListener('mouseup', onMouseUp, false);

    const features = new itowns.FeatureCollection({
        crs: 'EPSG:3857'
    });
    //const feature = new itowns.Feature('POLYGON', features);

    let controlPoints: Object3D[] = [];
    let intersects;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane();
    plane.setFromCoplanarPoints(
        new THREE.Vector3(),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 1)
    );

    const cursorWorldPosition = new THREE.Vector3();
    function onMouseMove(event: MouseEvent) {
        if (event.button != THREE.MOUSE.RIGHT) return;
        intersects = raycaster.intersectObjects(controlPoints);
        if (intersects.length > 0) {
        }
        // Coordinates in pixel on the screen
    }

    function onMouseUp(event: MouseEvent) {
        if (event.button != THREE.MOUSE.RIGHT) return;
        const viewCoords = view.eventToViewCoords(event)!;
        if (view.getPickingPositionFromDepth(viewCoords, cursorWorldPosition)) {
            console.log(cursorWorldPosition);
        }
    }
}


export default {
    main
}
