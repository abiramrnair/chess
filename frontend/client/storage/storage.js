export const storage = {
	player_turn: "W",
	opposite_player: {
		W: "B",
		B: "W",
	},
	king_pos: {
		W: [7, 4],
		B: [0, 4],
	},
	board: [],
	moves: {},
	move_log: [],
	legal_squares: [],
	en_passant_square: [],
	selected_square_coord: null,
	alpha: ["A", "B", "C", "D", "E", "F", "G"],
	nums: ["1", "2", "3", "4", "5", "6", "7", "8"],
};

export default storage;
