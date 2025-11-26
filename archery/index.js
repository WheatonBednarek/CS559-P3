import { exportStateStringAsURL, loadStateString } from "../util.js";
import { ArcheryState } from "./ArcheryState.js";

const state = new ArcheryState();
state.load(loadStateString());

const input = document.getElementById('state');
input.value = state.encode();
const save = document.getElementById('save');
save.addEventListener('click', () => {
	state.load(input.value);
	input.value = state.encode();
	window.location = exportStateStringAsURL(state.encode());
})