import * as THREE from 'three';
import { World } from '../World.js';
import { CameraControls } from '../CameraControls.js';
import { WorldObject } from '../WorldObject.js';
import { SkyBox } from './SkyBox.js';
import { Ground } from './Ground.js';
import { Target } from './Target.js';
import { Arrow, getArrowPos } from './Arrow.js';
import { state } from './ArcheryState.js';

export const world = new World();
world.camera.position.y = .45;
world.addObject(new CameraControls(world.camera, world.renderer));
world.camera.rotation.set(0, 0, 0);

world.addObject(new SkyBox());
world.addObject(new Ground());

const target = new Target();
target.object.translateY(0.45);
target.object.translateZ(-1 - (.15/2));
world.addObject(target);

document.onclick = (event) => {
	const { x, y} = event;
	const { pos, score } = getArrowPos(x, y);
	const arrow = new Arrow(world.camera);
	arrow.object.position.add(pos);
	state.shot(score);
	world.addObject(arrow);
	if(state.persistentState.currentPlayer === 1) {
		document.getElementById("player").innerText = "1";
	} else {
		document.getElementById("player").innerText = "2";
	}
}