import { exportStateStringAsURL, loadStateString } from "../util.js";
import { ArcheryState } from "./ArcheryState.js";
import { world } from "./world.js";

const state = new ArcheryState();
state.load(loadStateString());

let prevTime = 0;
world.renderer.setAnimationLoop( time => {
	world.tick(time, time - prevTime);
	prevTime = time;
	world.renderer.render(world.scene, world.camera);
});
document.body.appendChild(world.renderer.domElement);