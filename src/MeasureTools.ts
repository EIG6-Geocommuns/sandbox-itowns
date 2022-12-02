import * as itowns from 'itowns';
import * as THREE from 'three';
import { Measure } from './Measure';

class MeasuringTool extends THREE.EventDispatcher {
    scene = new THREE.Scene();
    light = new THREE.PointLight(0xffffff, 1.0);

    view: itowns.View;
    renderer?: any;

    constructor(view: itowns.View) {
        super();

        this.view = view;
        this.renderer = {};

        this.scene.add(this.light);
        const remove = (e: any) => {
            this.scene.remove(e.measurement);
        };
        const onAdd = (e: any) => {
            this.scene.add(e.measurement);
        };
    }

    onSceneChange(e: THREE.Event) { /* TODO */ }

    startInsertion(args = {}): Measure {
        let domElement = this.view.domElement;
        let measure = new Measure(this.view);

        this.dispatchEvent({
            type: 'start_inserting_measurement',
            measure: measure
        });

        // TODO: Measure options
        this.scene.add(measure);

        const removeLastMarker = measure.maxMarkers > 3;
        let cancelCallback = (e: MouseEvent) => {
            if (removeLastMarker) {
                measure.removeMarker(measure.points.length - 1);
                domElement.removeEventListener('mouseup', insertionCallback, false);
            }
        };

        let insertionCallback = (e: MouseEvent) => {
            if (e.button === THREE.MOUSE.RIGHT) {
                measure.addMarker(measure.points[measure.points.length -1].position.clone());

                if (measure.points.length >= measure.maxMarkers) {
                    cancelCallback(e);
                }
            } else if (e.button == THREE.MOUSE.LEFT) {
                cancelCallback(e);
            }
            measure.addMarker(new THREE.Vector3(0, 0, 0));
        };

        return measure;
    }
}
