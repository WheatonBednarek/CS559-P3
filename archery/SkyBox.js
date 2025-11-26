import * as THREE from 'three';
import { WorldObject } from '../WorldObject.js';
import { LOAD_TEXTURES } from '../constants.js';

export class SkyBox extends WorldObject {
	constructor() {
		super();
		const loader = new THREE.TextureLoader();
		const material = LOAD_TEXTURES ? [
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-front.png')}),
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-back.png')}),
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-up.png')}),
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-down.png')}),
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-left.png')}),
			new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load('./textures/skybox-right.png')})
		] : new THREE.MeshBasicMaterial({color: 'skyblue', side: THREE.DoubleSide});
		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(1000, 1000, 1000),
			material
		);
	}
}