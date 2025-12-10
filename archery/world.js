import * as THREE from 'three';
import { World } from '../World.js';
import { CameraControls } from '../CameraControls.js';
import { WorldObject } from '../WorldObject.js';
import { SkyBox } from './SkyBox.js';
import { Ground } from './Ground.js';
import { Target } from './Target.js';
import { Arrow, getArrowPos } from './Arrow.js';
import { state } from './ArcheryState.js';
import { Shooter } from './Shooter.js';

export const world = new World();
world.camera.position.y = .45;
// world.addObject(new CameraControls(world.camera, world.renderer));
state.registerOnUpdate(s => {
	Shooter.timeLimit = (4 - s.round) * 1000;
	Shooter.windMag = s.windMag;
	Shooter.windDir = s.windDir;
});
world.addObject(new Shooter(world));
world.camera.rotation.set(0, 0, 0);

world.addObject(new SkyBox());
world.addObject(new Ground());

const target = new Target();
target.object.translateY(0.45);
target.object.translateZ(-1 - (.15/2));
world.addObject(target);