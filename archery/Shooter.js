import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";
import { shoot } from './Arrow.js';
import { state } from './ArcheryState.js';

state.registerOnUpdate(s => {
	Shooter.timeLimit = (4 - s.round) * 1000;
	Shooter.windMag = s.windMag;
	Shooter.windDir = s.windDir;
});
export class Shooter extends WorldObject {
	static timeLimit;
	static windMag;
	static windDir;
	constructor(world) {
		super();
		this.currPos = {x: 0, y: 0};
		this.mouseDown = false;
		this.mouseDownTime = -1;
		this.timeout = -1;
		document.onmousedown = event => {
			this.currPos = { x: 0, y: 0 };
			this.mouseDown = true;
			this.mouseDownTime = Date.now();
			this.timeout = setTimeout(() => {
				this.mouseDown = false;
				shoot(this.currPos.x, this.currPos.y, world, Shooter.windMag, Shooter.windDir);
			}, Shooter.timeLimit);
		}
		const pixNorm = (window.innerHeight = window.innerWidth) / 10;

		const movementModifier = 5;
		document.onmousemove = event => {
			if (this.mouseDown) {
				const timeElapsed = (Date.now() - this.mouseDownTime)/1000;
				const mod = 1 / (2*timeElapsed + 1);
				const relX = event.movementX / pixNorm;
				const relY = event.movementY / pixNorm;
				this.currPos.x += relX * mod;
				this.currPos.y += -relY * mod;
			}
		}

		document.onmouseup = event => {
			if(this.mouseDown){
				this.mouseDown = false;
				shoot(this.currPos.x, this.currPos.y, world, Shooter.windMag, Shooter.windDir);
				this.currPos = {x: 0, y: 0};
				clearTimeout(this.timeout);
			}
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
		const scalar = Math.min(1, (Shooter.timeLimit - (Date.now() - this.mouseDownTime))/1000)
		this.object.scale.set(scalar, scalar, scalar);
	}
}