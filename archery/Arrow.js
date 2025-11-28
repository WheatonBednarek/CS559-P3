import * as THREE from 'three';
import { WorldObject } from "../WorldObject.js";

export class Arrow extends WorldObject {
	static START_Z = 0;

	constructor() {
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
	}

	spawnTime = -1;
	tick(time) {
		if(this.spawnTime < 0) {
			this.spawnTime = time;
		} else {
			const secondsAlive = (time - this.spawnTime)/1000;
			this.object.position.z = Math.max(
				-1,
				secondsAlive * -1 + Arrow.START_Z
			);
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