import { exportStateStringAsURL, loadStateString } from "../util.js";
import { state } from "./ArcheryState.js";
import { world } from "./world.js";

const htmlElements = {
	round: document.getElementById('round'),
	player1Score: document.getElementById('player1-score'),
	player2Score: document.getElementById('player2-score'),
	turnPlayer: document.getElementById('player'),
	windMag: document.getElementById('windMag'),
	windDir: document.getElementById('windDir'),
	modalRound: document.getElementById('modal-round'),
	modalPlayer1Score: document.getElementById('modal-player1-score'),
	modalPlayer2Score: document.getElementById('modal-player2-score'),
	modalLink: document.getElementById('modal-link')
};
state.registerOnUpdate(s => {
	htmlElements.round.innerText = s.round;
	htmlElements.player1Score.innerText = s.player1Score;
	htmlElements.player2Score.innerText = s.player2Score;
	htmlElements.modalRound.innerText = s.round;
	htmlElements.modalPlayer1Score.innerText = s.player1Score;
	htmlElements.modalPlayer2Score.innerText = s.player2Score;
	htmlElements.modalLink.value = exportStateStringAsURL(state.encode());
	if(s.currentPlayer === 1) {
		htmlElements.player1Score.classList = 'active-player';
		htmlElements.player2Score.classList = '';
	} else {
		htmlElements.player1Score.classList = '';
		htmlElements.player2Score.classList = 'active-player';
	}
	htmlElements.turnPlayer.innerText = s.currentPlayer
	htmlElements.windMag.innerText = s.windMag.toPrecision(2);
	htmlElements.windDir.style.transform = `rotate(${s.windDir}rad)`;
});
state.load(loadStateString());

document.getElementById("sendBtn").addEventListener("click", async () => {
    const link = document.getElementById("modal-link").value;

    try {
        await navigator.clipboard.writeText(link);
    } catch (err) {
		alert('unable to copy link')
	}

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Archery',
                text: `${state.persistentState.player1Score} to ${state.persistentState.player2Score}`,
                url: link
            });
        } catch (err) {
            console.error('Share cancelled:', err);
        }
    } else {
        alert('Link copied! You can paste and share it.');
    }
});

let prevTime = 0;
world.renderer.setAnimationLoop( time => {
	world.tick(time, time - prevTime);
	prevTime = time;
	world.renderer.render(world.scene, world.camera);
});
document.body.appendChild(world.renderer.domElement);