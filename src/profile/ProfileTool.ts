import * as itowns from 'itowns';
import * as THREE from 'three';

export class ProfileTool {
    private view: itowns.GlobeView;

    constructor(view: itowns.GlobeView) {
        this.view = view;
    }

    startInsertion(args: {name?: string} = {}) {
        let domElt = this.view.domElement;

        let profile: any = {};
        profile.name = args.name || 'Profile'; // profile.name

        let insertionCallback = (e: MouseEvent) => {
            if (e.button == THREE.MOUSE.LEFT) {
                if (profile.points.length <= 1) { // profile.points.length
                    let camera = this.view.camera;
                    // TODO
                }
            } else if (e.button == THREE.MOUSE.RIGHT) {
                profile.removeMarker(profile.points.length - 1);
                domElt.removeEventListener('mouseup', insertionCallback, false);
            }
        }

        profile.addMarker(new THREE.Vector3(0, 0, 0));
        // profile.spheres.length - 1
        // this.viewer.scene.addProfile(profile)

        return profile
    }
}
