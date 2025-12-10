import { State } from "../State.js";
import { clearListeners } from "./Shooter.js";

/**
 * @implements {State}
 */
export class ArcheryState extends State {
	persistentState = {
		currentPlayer: 0,
		round: 0,
		player1Score: 0,
		player2Score: 0,
		windDir: 0,
		windMag: 0,
		winningPlayer: ''
	}

	lazyState = {
		shots: 0
	}

	load(state) {
		try {
			this.persistentState = JSON.parse(state);
		} catch(e) {
			this.persistentState = {
				currentPlayer: 1,
				round: 1,
				player1Score: 0,
				player2Score: 0,
				windDir: Math.random() * Math.PI * 2,
				windMag: Math.random(),
				winningPlayer: ''
			}
		}
		this.onUpdate({...this.persistentState, ...this.lazyState});
		// if(this.persistentState.round > 4) {
		// 	setTimeout(() => document.getElementById('endGameModal').style.display= 'block', 500);
		// }
	}

	encode() {
		return JSON.stringify(this.persistentState);
	}

	shot(score) {
		if(this.persistentState.currentPlayer == 1) {
			this.persistentState.player1Score += score;
		} else {
			this.persistentState.player2Score += score;
		}
		this.lazyState.shots++;
		if(this.lazyState.shots === 3) {
			this.persistentState.currentPlayer = (this.persistentState.currentPlayer + 1) % 2;
			this.lazyState.shots = 0;
			if(this.persistentState.currentPlayer === 1) {
				this.persistentState.round++;
				if(this.persistentState.round > 3) {
					this.persistentState.winningPlayer = this.persistentState.player1Score > this.persistentState.player2Score ? 'Player 1' : this.persistentState.player1Score < this.persistentState.player2Score ? 'Player 2' : 'Tie';
					clearListeners();
					setTimeout(() => document.getElementById('endGameModal').style.display= '', 1500);
					this.onUpdate({...this.persistentState, ...this.lazyState});
					return;
				}
			}
			clearListeners();
			setTimeout(() => document.getElementById('blackout').style.display= '', 1500);
		}
		this.persistentState.windDir = Math.random() * 2 * Math.PI;
		this.persistentState.windMag = this.persistentState.round * Math.max(Math.random(), .25);
		this.onUpdate({...this.persistentState, ...this.lazyState});
	}
} 

export const state = new ArcheryState();