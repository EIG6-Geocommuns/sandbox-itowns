import * as THREE from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';

type MarkerGeomerty = THREE.SphereGeometry;
type MarkerMaterial = THREE.MeshLambertMaterial;
type MarkerMesh = THREE.Mesh<MarkerGeomerty, MarkerMaterial>;

export class Measure extends THREE.Group {
    private static counter = 0;

    name = 'Measure_' + Measure.counter;
    points: Array<{ position: THREE.Vector3}> = [];
    maxMarkers = Number.MAX_SAFE_INTEGER;

    sphereGeometry = new THREE.SphereGeometry(0.4, 10, 10);
    color = new THREE.Color(0xff0000);

    spheres: Array<MarkerMesh> = [];
    edges: Array<Line2> = [];

    constructor(view: any) {
        super();

        Measure.counter++;
    }

    createSphereMaterial(): MarkerMaterial {
        return new THREE.MeshLambertMaterial({
            color: this.color,
            depthTest: false,
            depthWrite: false
        });
    }

    addMarker(p: THREE.Vector3) {
        const point = { position: p };
        this.points.push(point);

        // Marker
        let sphere = new THREE.Mesh(this.sphereGeometry, this.createSphereMaterial());
        this.add(sphere);
        this.spheres.push(sphere);

        // Edges
        {
            let lineGeometry = new LineGeometry();
            lineGeometry.setPositions([
                0, 0, 0,
                0, 0, 0
            ]);

            let lineMaterial = new LineMaterial({
                color: 0xff0000,
                linewidth: 2,
                resolution: new THREE.Vector2(1000, 1000)
            });
            lineMaterial.depthTest = false;

            let edge = new Line2(lineGeometry, lineMaterial);
            edge.visible = true;
            this.add(edge);
            this.edges.push(edge);
        }

        // Event listeners
        {
            let mouseover = (e: {target: MarkerMesh}) => {
                e.target.material.emissive.setHex(0x888888);
            }
            let mouseleave = (e: {target: MarkerMesh}) => {
                e.target.material.emissive.setHex(0x888888);
            }
            sphere.addEventListener('mouseover', mouseover);
            sphere.addEventListener('mouseleave', mouseleave);
        }

        let event = {
            type: 'marker_added',
            measurement: this,
            sphere: sphere
        };
        this.dispatchEvent(event);

        this.setMarker(this.points.length - 1, point);
    }

    removeMarker(index: number) {
        this.points.splice(index, 1);
        this.remove(this.spheres[index]);

        let edgeIndex = (index === 0)? 0 : (index - 1);
        this.remove(this.edges[edgeIndex]);
        this.edges.splice(edgeIndex, 1);

        this.spheres.splice(index, 1);
        this.update();

        this.dispatchEvent({
            type: 'marker_removed',
            measurement: this
        });
    }

    setMarker(index: number, point: { position: THREE.Vector3 }) {
        this.points[index] = point;

        let event = {
            type: 'marker_moved',
            measure: this,
            index: index,
            position: point.position.clone()
        };
        this.dispatchEvent(event);

        this.update();
    }

    // TODO: More methods
    update() {
        if (this.points.length === 0) return;
        else if (this.points.length === 1) {
            let point = this.points[0];
            let position = point.position;
            this.spheres[0].position.copy(position);
            return;
        }
        console.warn('Not yet implemented update');
    }
}
