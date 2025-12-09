import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";
import { shoot } from './Arrow.js';

export class Shooter extends WorldObject {
	constructor(world) {
		super();
		this.currPos = {x: 0, y: 0};
		this.mouseDown = false;
		document.onmousedown = event => {
			this.currPos = { x: 0, y: 0 };
			this.mouseDown = true;
		}
		const pixNorm = (window.innerHeight = window.innerWidth) / 10;

		const movementModifier = 5;
		document.onmousemove = event => {
			if (this.mouseDown) {
				const relX = event.movementX / pixNorm;
				const relY = event.movementY / pixNorm;
				this.currPos.x += relX;
				this.currPos.y += -relY;
				console.log(relX, relY);
			}
		}

		document.onmouseup = event => {
			this.mouseDown = false;
			console.log(this.currPos);
			shoot(this.currPos.x, this.currPos.y, world);
			this.currPos = {x: 0, y: 0}
		}

		const material = new THREE.MeshBasicMaterial({ color: 'black' });
		const size = .05;
		const modifier = 10;
		const crosshair = new THREE.Group();
		crosshair.add(new THREE.Mesh(
			new THREE.PlaneGeometry(size/modifier, size),
			material
		));crosshair.add(new THREE.Mesh(
			new THREE.PlaneGeometry(size, size/modifier),
			material
		));
		crosshair.translateY(.45);
		crosshair.translateZ(-.99999);
		this.object = crosshair;
	}

	tick() {
		this.object.position.setX(this.currPos.x * .225);
		this.object.position.setY(this.currPos.y * .225 + .45);
		this.object.visible = this.mouseDown;
	}
}