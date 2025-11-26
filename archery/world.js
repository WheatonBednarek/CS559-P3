import * as THREE from 'three';
import { World } from '../World.js';
import { CameraControls } from '../CameraControls.js';
import { WorldObject } from '../WorldObject.js';
import { SkyBox } from './SkyBox.js';
import { Ground } from './Ground.js';

export const world = new World();
world.camera.position.z = 1;
world.addObject(new CameraControls(world.camera, world.renderer))

class Cube extends WorldObject {
	constructor() {
		super();
		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(.2, .2, .2),
			new THREE.MeshNormalMaterial()
		);
	}

	tick(time, dt) {
		this.object.rotation.x = time / 2000;
		this.object.rotation.y = time / 1000;
	}
}

world.addObject(new Cube());
world.addObject(new SkyBox());
world.addObject(new Ground());