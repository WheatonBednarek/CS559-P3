import * as THREE from 'three';
import { WorldObject } from './WorldObject.js';

export class World {
	scene = new THREE.Scene();
	listeners = [];
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 100000);
	renderer = new THREE.WebGLRenderer({ antialias: true });

	constructor() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	/**
	 * adds an object to the world
	 * @param {WorldObject} object 
	 */
	addObject(object) {
		this.scene.add(object.object);
		this.listeners.push((a, b) => object.tick(a, b));
	}

	/**
	 * ticks every object
	 * @param {number} time 
	 * @param {number} timeDelta 
	 */
	tick(time, timeDelta) {
		this.listeners.forEach(tick => tick(time, timeDelta))
	}
}