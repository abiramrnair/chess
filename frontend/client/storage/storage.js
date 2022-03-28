export const storage = {
	player_turn: "W",
	opposite_player: {
		W: "B",
		B: "W",
	},
	king_checked: {
		W: false,
		B: false,
	},
	board: [],
	moves: {},
	move_log: [],
	game_over: false,
	legal_squares: [],
	en_passant_square: [],
	selected_square_coord: null,
	promotion_coord: null,
	promotion_pieces: ["R", "N", "B", "Q"],
	alpha: ["A", "B", "C", "D", "E", "F", "G"],
	nums: ["1", "2", "3", "4", "5", "6", "7", "8"],
};

export default storage;
