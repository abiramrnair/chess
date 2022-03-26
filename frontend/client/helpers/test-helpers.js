export const testHelpers = {
	initialBoardLayoutArray: [
		["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
		["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
		["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
	],
	fenStringExampleOne: [
		["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
		["bP", "bP", "", "bP", "bP", "bP", "bP", "bP"],
		["", "", "", "", "", "", "", ""],
		["", "", "bP", "", "", "", "", ""],
		["", "", "", "", "wP", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["wP", "wP", "wP", "wP", "", "wP", "wP", "wP"],
		["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
	],
	fenStringExampleTwo: [
		["bR", "", "bB", "", "bK", "", "", "bR"],
		["bP", "bP", "", "", "bB", "bP", "", "bP"],
		["", "", "bN", "bP", "", "bN", "", ""],
		["bQ", "", "bP", "", "bP", "", "bP", ""],
		["", "wP", "", "wP", "wP", "wP", "", ""],
		["wN", "", "wP", "", "wB", "", "", "wN"],
		["wP", "", "", "", "", "", "wP", "wP"],
		["wR", "", "", "wQ", "wK", "wB", "", "wR"],
	],
};

export default testHelpers;
