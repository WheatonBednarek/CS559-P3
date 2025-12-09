import { exportStateStringAsURL, loadStateString } from "../util.js";
import { state } from "./ArcheryState.js";
import { world } from "./world.js";

const htmlElements = {
	round: document.getElementById('round'),
	player1Score: document.getElementById('player1-score'),
	player2Score: document.getElementById('player2-score'),
	windMag: document.getElementById('windMag'),
	windDir: document.getElementById('windDir'),
};
state.registerOnUpdate(state => {
	console.log(state);
	htmlElements.round.innerText = state.round;
	htmlElements.player1Score.innerText = state.player1Score;
	htmlElements.player2Score.innerText = state.player2Score;
	if(state.currentPlayer === 1) {
		htmlElements.player1Score.classList = 'active-player';
		htmlElements.player2Score.classList = '';
	} else {
		htmlElements.player1Score.classList = '';
		htmlElements.player2Score.classList = 'active-player';
	}
	htmlElements.windMag.innerText = state.windMag.toPrecision(2);
	htmlElements.windDir.innerHTML = `&#8593;`; // ↑ arrow
	htmlElements.windDir.style.transform = `rotate(${state.windDir}rad)`;
	htmlElements.windDir.style.display = "inline-block";
});
state.load(loadStateString());

let prevTime = 0;
world.renderer.setAnimationLoop( time => {
	world.tick(time, time - prevTime);
	prevTime = time;
	world.renderer.render(world.scene, world.camera);
});
document.body.appendChild(world.renderer.domElement);