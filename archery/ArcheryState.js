/**
 * @implements {State}
 */
export class ArcheryState {
	state = {
		currentPlayer: 0,
		round: 0,
		player1Score: 0,
		player2Score: 0
	}

	load(state) {
		try {
			this.state = JSON.parse(state);
		} catch(e) {
			this.state = {
				currentPlayer: 1,
				round: 1,
				player1Score: 0,
				player2Score: 0
			}
		}
	}

	encode() {
		return JSON.stringify(this.state);
	}
} 
