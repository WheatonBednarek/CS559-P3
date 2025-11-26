import * as THREE from 'three';

export class WorldObject {
	/**
	 * @param {number} time 
	 * @param {number} timeDelta 
	 */
	tick(time, timeDelta) {}
	object = new THREE.Group();
}