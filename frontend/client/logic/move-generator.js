import boardSquareModel from "../board-square/board-square-model";
import storage from "../storage/storage";
const _ = require("lodash");

export const moveGenerator = {
	generateAllPossibleMoves: () => {
		storage.moves = {};
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (storage.board[i][j].pieceSide === storage.player_turn) {
					switch (storage.board[i][j].pieceId) {
						case "P":
							moveGenerator.generateAllPawnMoves(i, j);
							break;
						case "R":
							moveGenerator.generateAllRookMoves(i, j);
							break;
						case "N":
							moveGenerator.generateAllKnightMoves(i, j);
							break;
						case "B":
							moveGenerator.generateAllBishopMoves(i, j);
							break;
						case "Q":
							moveGenerator.generateAllQueenMoves(i, j);
							break;
						case "K":
							moveGenerator.generateAllKingMoves(i, j);
							break;
						default:
							break;
					}
				}
			}
		}
	},
	generateAllPawnMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];
		const z = storage.board[i][j].pieceSide === "W" ? -1 : 1;
		const opposite_player = storage.board[i][j].pieceSide === "W" ? "B" : "W";

		// single square
		if (i + z >= 0 && i + z < 8 && !storage.board[i + z][j].pieceId) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j]);
		}

		// Diagonal captures
		if (i + z >= 0 && i + z < 8) {
			if (
				j + 1 < 8 &&
				storage.board[i + z][j + 1].pieceSide === opposite_player
			) {
				storage.moves[JSON.stringify([i, j])].push([i + z, j + 1]);
			}
			if (
				j + 1 < 8 &&
				!storage.board[i + z][j + 1].pieceSide &&
				storage.board[i + z][j + 1].enPassant
			) {
				storage.moves[JSON.stringify([i, j])].push([i + z, j + 1]);
			}
			if (
				j - 1 >= 0 &&
				storage.board[i + z][j - 1].pieceSide === opposite_player
			) {
				storage.moves[JSON.stringify([i, j])].push([i + z, j - 1]);
			}
			if (
				j - 1 >= 0 &&
				!storage.board[i + z][j - 1].pieceSide &&
				storage.board[i + z][j - 1].enPassant
			) {
				storage.moves[JSON.stringify([i, j])].push([i + z, j - 1]);
			}
		}

		// two squares if first move
		if (
			i + 2 * z >= 0 &&
			i + 2 * z < 8 &&
			!storage.board[i + 2 * z][j].pieceId &&
			((storage.board[i][j].pieceSide === "W" && i === 6) ||
				(storage.board[i][j].pieceSide === "B" && i === 1))
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 2 * z, j]);
		}

		if (
			!storage.moves[JSON.stringify([i, j])] &&
			!storage.moves[JSON.stringify([i, j])].length
		) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	generateAllRookMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];

		const opposite_player = storage.board[i][j].pieceSide === "W" ? "B" : "W";
		let z = 1;

		while (
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j + z]);
			if (storage.board[i][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j - z]);
			if (storage.board[i][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j]);
			if (storage.board[i + z][j].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j]);
			if (storage.board[i - z][j].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}

		if (!storage.moves[JSON.stringify([i, j])].length) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	generateAllKnightMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];

		if (
			i + 1 < 8 &&
			j + 2 < 8 &&
			storage.board[i + 1][j + 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 1, j + 2]);
		}
		if (
			i + 1 < 8 &&
			j - 2 >= 0 &&
			storage.board[i + 1][j - 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 1, j - 2]);
		}
		if (
			i - 1 >= 0 &&
			j + 2 < 8 &&
			storage.board[i - 1][j + 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 1, j + 2]);
		}
		if (
			i - 1 >= 0 &&
			j - 2 >= 0 &&
			storage.board[i - 1][j - 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 1, j - 2]);
		}
		if (
			i + 2 < 8 &&
			j + 1 < 8 &&
			storage.board[i + 2][j + 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 2, j + 1]);
		}
		if (
			i + 2 < 8 &&
			j - 1 >= 0 &&
			storage.board[i + 2][j - 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 2, j - 1]);
		}
		if (
			i - 2 >= 0 &&
			j + 1 < 8 &&
			storage.board[i - 2][j + 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 2, j + 1]);
		}
		if (
			i - 2 >= 0 &&
			j - 1 >= 0 &&
			storage.board[i - 2][j - 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 2, j - 1]);
		}

		if (!storage.moves[JSON.stringify([i, j])].length) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	generateAllBishopMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];
		const opposite_player = storage.board[i][j].pieceSide === "W" ? "B" : "W";
		let z = 1;

		while (
			i + z < 8 &&
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j + z]);
			if (storage.board[i + z][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j + z]);
			if (storage.board[i - z][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j - z]);
			if (storage.board[i + z][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j - z]);
			if (storage.board[i - z][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}

		if (!storage.moves[JSON.stringify([i, j])].length) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	generateAllQueenMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];
		const opposite_player = storage.board[i][j].pieceSide === "W" ? "B" : "W";
		let z = 1;

		while (
			i + z < 8 &&
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j + z]);
			if (storage.board[i + z][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j + z]);
			if (storage.board[i - z][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j - z]);
			if (storage.board[i + z][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j - z]);
			if (storage.board[i - z][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i][j + z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j + z]);
			if (storage.board[i][j + z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			j - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i][j - z].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j - z]);
			if (storage.board[i][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + z, j]);
			if (storage.board[i + z][j].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - z][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - z, j]);
			if (storage.board[i - z][j].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}

		if (!storage.moves[JSON.stringify([i, j])].length) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	generateAllKingMoves: (i, j) => {
		storage.moves[JSON.stringify([i, j])] = [];
		if (
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i][j + 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j + 1]);
		}
		if (
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i][j - 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i, j - 1]);
		}
		if (
			i + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 1, j]);
		}
		if (
			i - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 1, j]);
		}
		if (
			i + 1 < 8 &&
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j + 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 1, j + 1]);
		}
		if (
			i - 1 >= 0 &&
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j + 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 1, j + 1]);
		}
		if (
			i + 1 < 8 &&
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j - 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i + 1, j - 1]);
		}
		if (
			i - 1 >= 0 &&
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j - 1].pieceSide
		) {
			storage.moves[JSON.stringify([i, j])].push([i - 1, j - 1]);
		}
		if (storage.board[i][j].firstMove) {
			if (storage.board[i][j].pieceSide === "W" && i === 7 && j === 4) {
				if (
					!storage.board[i][j + 1].pieceId &&
					!storage.board[i][j + 2].pieceId &&
					storage.board[i][j + 3].pieceId === "R" &&
					storage.board[i][j + 3].pieceSide === storage.board[i][j].pieceSide
				) {
					storage.moves[JSON.stringify([i, j])].push([i, j + 2]);
					storage.board[i][j].kingSideCastle = true;
				}
				if (
					!storage.board[i][j - 1].pieceId &&
					!storage.board[i][j - 2].pieceId &&
					!storage.board[i][j - 3].pieceId &&
					storage.board[i][j - 4].pieceId === "R" &&
					storage.board[i][j - 4].pieceSide === storage.board[i][j].pieceSide
				) {
					storage.moves[JSON.stringify([i, j])].push([i, j - 2]);
					storage.board[i][j].queenSideCastle = true;
				}
			} else if (storage.board[i][j].pieceSide === "B" && i === 0 && j === 4) {
				if (
					!storage.board[i][j + 1].pieceId &&
					!storage.board[i][j + 2].pieceId &&
					storage.board[i][j + 3].pieceId === "R" &&
					storage.board[i][j + 3].pieceSide === storage.board[i][j].pieceSide
				) {
					storage.moves[JSON.stringify([i, j])].push([i, j + 2]);
					storage.board[i][j].kingSideCastle = true;
				}
				if (
					!storage.board[i][j - 1].pieceId &&
					!storage.board[i][j - 2].pieceId &&
					!storage.board[i][j - 3].pieceId &&
					storage.board[i][j - 4].pieceId === "R" &&
					storage.board[i][j - 4].pieceSide === storage.board[i][j].pieceSide
				) {
					storage.moves[JSON.stringify([i, j])].push([i, j - 2]);
					storage.board[i][j].queenSideCastle = true;
				}
			}
		}

		if (!storage.moves[JSON.stringify([i, j])].length) {
			delete storage.moves[JSON.stringify([i, j])];
		}
	},
	filterIllegalMoves: () => {
		const allyKeys = Object.keys(storage.moves);
		const allyMoves = [];
		const ally_side = storage.player_turn;

		for (let i = 0; i < allyKeys.length; i++) {
			const startingCoord = JSON.parse(allyKeys[i]);
			const moves = storage.moves[allyKeys[i]];
			if (moves.length) {
				allyMoves.push({ startingCoord, moves });
			}
		}

		for (let i = 0; i < allyMoves.length; i++) {
			const startingCoord = allyMoves[i].startingCoord;
			const moves = allyMoves[i].moves;

			for (let j = 0; j < moves.length; j++) {
				boardSquareModel.movePiece(startingCoord, moves[j]);
				moveGenerator.generateAllPossibleMoves();
				const enemyKeys = Object.keys(storage.moves);

				for (let k = 0; k < enemyKeys.length; k++) {
					const enemyMoves = storage.moves[enemyKeys[k]];

					for (let m = 0; m < enemyMoves.length; m++) {
						if (
							JSON.stringify(enemyMoves[m]) ===
							JSON.stringify(storage.king_pos[ally_side])
						) {
							moves[j] = null;
						}
					}
				}
				boardSquareModel.undoMovePiece();
				moveGenerator.generateAllPossibleMoves();
			}
		}

		for (let i = 0; i < allyMoves.length; i++) {
			const startingCoord = JSON.stringify(allyMoves[i].startingCoord);
			storage.moves[startingCoord] = allyMoves[i].moves;
		}
	},
	getMoves: () => {
		moveGenerator.generateAllPossibleMoves();
		moveGenerator.filterIllegalMoves();
	},
};

export default moveGenerator;
