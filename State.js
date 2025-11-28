export class State {
	listeners = [];
	load(s) {}
	encode() {return '';}
	registerOnUpdate(cb) {
		this.listeners.push(cb);
	}
	onUpdate(state) {
		this.listeners.forEach(cb => cb(state));
	}
}