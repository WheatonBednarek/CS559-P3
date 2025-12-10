import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";
import { shoot } from './Arrow.js';
import { state } from './ArcheryState.js';

export function clearListeners() {
	listeners.forEach( l => {
		document.removeEventListener('pointerdown', l);
		document.removeEventListener('pointermove', l);
		document.removeEventListener('pointerup', l);
	});
}
const listeners = [];

export class Shooter extends WorldObject {
	static timeLimit;
	static windMag;
	static windDir;
	static canShoot = true;
	constructor(world) {
		super();
		this.currPos = {x: 0, y: 0};
		this.mouseDown = false;
		this.mouseDownTime = -1;
		this.timeout = -1;
		function lockShoot() {
			Shooter.canShoot = false;
			setTimeout(() => Shooter.canShoot = true, 1500);
		}

		const onDown = event => {
			if(!Shooter.canShoot) return;
			this.currPos = { x: 0, y: 0 };
			this.mouseDown = true;
			this.mouseDownTime = Date.now();
			this.timeout = setTimeout(() => {
				this.mouseDown = false;
				shoot(this.currPos.x, this.currPos.y, world, Shooter.windMag, Shooter.windDir);
				lockShoot();
			}, Shooter.timeLimit);
			event.preventDefault();
		};
		const pixNorm = (window.innerHeight + window.innerWidth) / 10;

		const onMove = event => {
			if(!Shooter.canShoot) return;
			if (this.mouseDown) {
				const timeElapsed = (Date.now() - this.mouseDownTime)/1000;
				const mod = 1 / (3*timeElapsed + 1);
				const relX = event.movementX / pixNorm;
				const relY = event.movementY / pixNorm;
				this.currPos.x += relX * mod;
				this.currPos.y += -relY * mod;
			}
			event.preventDefault();
		};

		const onUp = event => {
			if(!Shooter.canShoot) return;
			if(this.mouseDown){
				this.mouseDown = false;
				shoot(this.currPos.x, this.currPos.y, world, Shooter.windMag, Shooter.windDir);
				lockShoot();
				this.currPos = {x: 0, y: 0};
				clearTimeout(this.timeout);
			}
			event.preventDefault();
		};

		listeners.push(onDown, onMove, onUp);
		document.addEventListener('pointerdown', onDown);
		document.addEventListener('pointermove', onMove);
		document.addEventListener('pointerup', onUp);

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