import { State } from "../State.js";

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
		windMag: 0
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
				windMag: Math.random()
			}
		}
		this.onUpdate({...this.persistentState, ...this.lazyState});
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
			}
		}
		this.persistentState.windDir = Math.random() * 2 * Math.PI;
		this.persistentState.windMag = this.persistentState.round * Math.max(Math.random(), .25);
		this.onUpdate({...this.persistentState, ...this.lazyState});
	}
} 

export const state = new ArcheryState();