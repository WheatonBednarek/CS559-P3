import * as THREE from 'three';
import { World } from '../World.js';
import { CameraControls } from '../CameraControls.js';
import { WorldObject } from '../WorldObject.js';
import { SkyBox } from './SkyBox.js';
import { Ground } from './Ground.js';
import { Target } from './Target.js';

export const world = new World();
world.camera.position.y = .45;
world.addObject(new CameraControls(world.camera, world.renderer));

world.addObject(new SkyBox());
world.addObject(new Ground());

const target = new Target();
target.object.translateY(.35);
target.object.translateZ(-1);
world.addObject(target);
world.camera.lookAt(target.object.position);