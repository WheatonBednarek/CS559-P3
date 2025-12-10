import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";
import { state } from './ArcheryState.js';

export class Arrow extends WorldObject {
	static START_Z = 1;

	constructor(camera) {
		super();

		const arrow = new THREE.Group();
		const stick = new THREE.Mesh(
			new THREE.CylinderGeometry(.005, .005, .09),
			new THREE.MeshBasicMaterial({ color: 'brown' })
		);
		arrow.add(stick);
		const head = new THREE.Mesh(
			new THREE.CylinderGeometry(0, .0065, .04),
			new THREE.MeshBasicMaterial({ color: 'grey' })
		);
		head.translateY(.06);
		arrow.add(head);

		const featherMaterial = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
		const shape = new THREE.Shape();
		shape.lineTo(.01, 0);
		shape.lineTo(0, .04);
		const featherGeometry = new THREE.ShapeGeometry(shape);
		const featherCount = 3;
		for(let i = 0; i < featherCount; i++) {
			const feather = new THREE.Mesh(featherGeometry, featherMaterial);
			feather.rotateY((2 * Math.PI) * (i/featherCount));
			feather.translateX(.005);
			feather.translateY(-.045)
			arrow.add(feather);
		}

		// double nest so arrow can be translated
		this.object = new THREE.Group();
		arrow.rotateX(-Math.PI/2);
		arrow.translateY(-.06);
		this.object.add(arrow);
		this.object.position.z = Arrow.START_Z;
		this.camera = camera;
	}

	spawnTime = -1;
	tick(time) {
		if(this.spawnTime < 0) {
			this.spawnTime = time;
		} else {
			const secondsAlive = (time - this.spawnTime)/1000;
			this.object.position.z = Math.max(
				-1,
				(secondsAlive+1)**2 * -1 + Arrow.START_Z
			);
			if(secondsAlive < 1.5) {
				this.camera.position.set(this.object.position.x, this.object.position.y + .1, this.object.position.z + .5);
			} else {
				this.camera.position.set(0, .45, 0);
				this.tick = ()=>{};
			}
		}
	}
}

export function getArrowPos(screenX, screenY) {
	const centerX = window.innerWidth / 2, centerY = window.innerHeight / 2;
	// console.log(new THREE.Vector2(centerX, centerY).sub(new THREE.Vector2(screenX, screenY)).length());
	const EDGE_PIX_DIST = 113;// magic number I get when clicking and checking console with above ^

	const xNorm = (screenX - centerX) / EDGE_PIX_DIST;
	const yNorm = (centerY - screenY) / EDGE_PIX_DIST;

	const pos = new THREE.Vector3(0, .45, -1);
	const TARGET_RADIUS = (.45/.5)*.25;
	pos.x += xNorm * TARGET_RADIUS;
	pos.y += yNorm * TARGET_RADIUS;

	const distance = Math.sqrt(xNorm**2 + yNorm**2);
	const score = Math.max(10 - Math.floor(distance * 10), 0);
	return { pos, score };
}

export function shoot(xNorm, yNorm, world, windMag, windDir) {
	const windVector = new THREE.Vector3();
	windVector.setFromCylindricalCoords(windMag, windDir, 0)
	windVector.y = windVector.z;
	windVector.z = 0;
	windVector.multiplyScalar(.05);
	const arrow = new Arrow(world.camera);
	const pos = new THREE.Vector3(0, .45, -1);
	const TARGET_RADIUS = (.45/.5)*.25;
	pos.x += xNorm * TARGET_RADIUS;
	pos.y += yNorm * TARGET_RADIUS;
	pos.add(windVector);
	const distance = Math.sqrt(pos.x**2 + (pos.y-.45)**2) / TARGET_RADIUS;
	const score = Math.max(10 - Math.floor(distance * 10), 0);
	arrow.object.position.add(pos);
	state.shot(score);
	world.addObject(arrow);
}