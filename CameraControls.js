import * as THREE from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { WorldObject } from './WorldObject.js';
export class CameraControls extends WorldObject {
	constructor(camera, renderer) {
		super()
		this.controls = new OrbitControls(camera, renderer.domElement)
	}
	tick() {}
	object = new THREE.Group();
}