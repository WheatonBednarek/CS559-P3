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
	modalLink: document.getElementById('modal-link'),
	endGameText: document.getElementById('endGameText'),
	endPlayer1Score: document.getElementById('end-player1-score'),
	endPlayer2Score: document.getElementById('end-player2-score')
};
state.registerOnUpdate(s => {
	htmlElements.round.innerText = s.round;
	htmlElements.player1Score.innerText = s.player1Score;
	htmlElements.player2Score.innerText = s.player2Score;
	htmlElements.modalRound.innerText = s.round;
	htmlElements.modalPlayer1Score.innerText = s.player1Score;
	htmlElements.modalPlayer2Score.innerText = s.player2Score;
	htmlElements.endPlayer1Score.innerText = s.player1Score;
	htmlElements.endPlayer2Score.innerText = s.player2Score;
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
	if(s.player1Score > s.player2Score) {
		htmlElements.endGameText.innerText = 'Player 1 wins!';
	} else if(s.player2Score > s.player1Score) {
		htmlElements.endGameText.innerText = 'Player 2 wins!';
	} else {
		htmlElements.endGameText.innerText = 'Tie!';
	}
	if(s.winningPlayer) {
		document.getElementById('endGameModal').style.display= ''
	}
});
state.load(loadStateString());

document.getElementById("shareBtn").addEventListener("click", async () => {
    const link = document.getElementById("modal-link").value;

    try {
        await navigator.clipboard.writeText(link);
    } catch (err) {
		alert('unable to copy link')
	}

    if (navigator.share) {
        try {
			let message;
			const myScore   = state.persistentState.currentPlayer === 1 ? state.persistentState.player1Score : state.persistentState.player2Score;
			const yourScore = state.persistentState.currentPlayer === 1 ? state.persistentState.player2Score : state.persistentState.player1Score;
			if (myScore > yourScore) {
				message = "I won";
			} else if (myScore < yourScore) {
				message = "You won";
			} else {
				message = "We tied";
			}
            await navigator.share({
                title: 'Archery',
                text: message,
                url: link
            });
        } catch (err) {
            console.error('Share cancelled:', err);
        }
    } else {
        alert('Link copied! You can paste and share it.');
    }
});

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