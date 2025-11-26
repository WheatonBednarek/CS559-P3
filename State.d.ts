interface State {
	/**
	 * loads an existing state
	 * @param encoded the string loaded in from the url
	 */
	load(encoded: string): void
	/**
	 * encodes the current state into a string to be encoded into the url
	 */
	encode(): string
}