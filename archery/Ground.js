import * as THREE from "three";
import { WorldObject } from "../WorldObject.js";
import { LOAD_TEXTURES } from "../constants.js";

export class Ground extends WorldObject {
	constructor() {
		super();
		const loader = new THREE.TextureLoader();
		const grassTexture = loader.load('./textures/grass.jpg', texture => {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(100, 100)
		})
		this.object = new THREE.Mesh(
			new THREE.PlaneGeometry(1000, 1000),
			new THREE.MeshBasicMaterial({
				color: 'lime',
				side: THREE.DoubleSide,
				map: LOAD_TEXTURES ? grassTexture : undefined
			})
		)
		this.object.rotateX(Math.PI/2);
	}
}