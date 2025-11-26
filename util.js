export function loadStateString() {
	const url = new URL(window.location);
	if(url.hash) {
		return atob(url.hash.substring(1));
	} else return '';
}

export function exportStateStringAsURL(state) {
	const url = new URL(window.location);
	url.hash = btoa(state);
	return url.toString();
}