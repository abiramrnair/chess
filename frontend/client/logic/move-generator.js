import boardSquareModel from "../board-square/board-square-model";
import boardHelpers from "../helpers/board-helpers";
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
			if (
				(storage.board[i][j].pieceSide === "W" && i === 1) ||
				(storage.board[i][j].pieceSide === "B" && i === 6)
			) {
				for (let p = 0; p < storage.promotion_pieces.length; p++) {
					storage.moves[JSON.stringify([i, j])].push([
						i + z,
						j,
						storage.promotion_pieces[p],
					]);
				}
			} else {
				storage.moves[JSON.stringify([i, j])].push([i + z, j]);
			}
		}

		// Diagonal captures
		if (i + z >= 0 && i + z < 8) {
			if (
				j + 1 < 8 &&
				storage.board[i + z][j + 1].pieceSide === opposite_player
			) {
				if (
					(storage.board[i][j].pieceSide === "W" && i === 1) ||
					(storage.board[i][j].pieceSide === "B" && i === 6)
				) {
					for (let p = 0; p < storage.promotion_pieces.length; p++) {
						storage.moves[JSON.stringify([i, j])].push([
							i + z,
							j + 1,
							storage.promotion_pieces[p],
						]);
					}
				} else {
					storage.moves[JSON.stringify([i, j])].push([i + z, j + 1]);
				}
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
				if (
					(storage.board[i][j].pieceSide === "W" && i === 1) ||
					(storage.board[i][j].pieceSide === "B" && i === 6)
				) {
					for (let p = 0; p < storage.promotion_pieces.length; p++) {
						storage.moves[JSON.stringify([i, j])].push([
							i + z,
							j - 1,
							storage.promotion_pieces[p],
						]);
					}
				} else {
					storage.moves[JSON.stringify([i, j])].push([i + z, j - 1]);
				}
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
			!storage.board[i + 1 * z][j].pieceId &&
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
		if (storage.board[i][j].firstMove && !storage.board[i][j].hasBeenChecked) {
			if (storage.board[i][j].pieceSide === "W" && i === 7 && j === 4) {
				if (
					!storage.board[i][j + 1].pieceId &&
					!storage.board[i][j + 2].pieceId &&
					storage.board[i][j + 3].pieceId === "R" &&
					storage.board[i][j + 3].firstMove &&
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
					storage.board[i][j - 4].firstMove &&
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
					storage.board[i][j + 3].firstMove &&
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
					storage.board[i][j - 4].firstMove &&
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
	filterIllegalCastleMoves: (startingCoord, moves) => {
		const stringMoves = moves.map((move) => JSON.stringify(move));
		if (startingCoord === JSON.stringify([0, 4])) {
			if (stringMoves.includes("[0,2]") && !stringMoves.includes("[0,3]")) {
				const index = stringMoves.findIndex((elem) => elem === "[0,2]");
				moves[index] = null;
			}
			if (stringMoves.includes("[0,6]") && !stringMoves.includes("[0,5]")) {
				const index = stringMoves.findIndex((elem) => elem === "[0,6]");
				moves[index] = null;
			}
		} else if (startingCoord === JSON.stringify([7, 4])) {
			if (stringMoves.includes("[7,2]") && !stringMoves.includes("[7,3]")) {
				const index = stringMoves.findIndex((elem) => elem === "[7,2]");
				moves[index] = null;
			}
			if (stringMoves.includes("[7,6]") && !stringMoves.includes("[7,5]")) {
				const index = stringMoves.findIndex((elem) => elem === "[7,6]");
				moves[index] = null;
			}
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
							JSON.stringify([enemyMoves[m][0], enemyMoves[m][1]]) ===
							JSON.stringify(boardHelpers.getKingPos(ally_side))
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
			if (
				startingCoord === JSON.stringify(boardHelpers.getKingPos(ally_side))
			) {
				moveGenerator.filterIllegalCastleMoves(
					startingCoord,
					storage.moves[startingCoord]
				);
			}
		}
		for (let i = 0; i < allyKeys.length; i++) {
			const moves = [];
			for (let j = 0; j < storage.moves[allyKeys[i]].length; j++) {
				if (storage.moves[allyKeys[i]][j]) {
					moves.push(storage.moves[allyKeys[i]][j]);
				}
			}
			if (moves.length) {
				storage.moves[allyKeys[i]] = moves;
			} else {
				delete storage.moves[allyKeys[i]];
			}
		}
	},
	determineEndGameConditions: () => {
		const allyMoves = _.cloneDeep(storage.moves);
		const allySide = storage.player_turn;
		const kingPos = boardHelpers.getKingPos(allySide);

		let inCheck = false;
		storage.player_turn = storage.opposite_player[storage.player_turn];
		moveGenerator.generateAllPossibleMoves();

		const enemyMoves = _.cloneDeep(storage.moves);
		const enemyKeys = Object.keys(enemyMoves);

		if (
			allyMoves[JSON.stringify(kingPos)] &&
			allyMoves[JSON.stringify(kingPos)].length
		) {
			for (let i = 0; i < enemyKeys.length; i++) {
				const moves = enemyMoves[enemyKeys[i]];
				for (let j = 0; j < moves.length; j++) {
					if (JSON.stringify(moves[j]) === JSON.stringify(kingPos)) {
						storage.board[kingPos[0]][kingPos[1]].inCheck = true;
						storage.board[kingPos[0]][kingPos[1]].hasBeenChecked = true;
						inCheck = true;
						const filterMoves = allyMoves[JSON.stringify(kingPos)].map((move) =>
							JSON.stringify(move)
						);
						if (allySide === "W" && JSON.stringify(kingPos) === "[7,4]") {
							const indexRight = filterMoves.findIndex(
								(elem) => elem === "[7,6]"
							);
							if (indexRight !== -1) {
								allyMoves[JSON.stringify(kingPos)][indexRight] = null;
							}
							const indexLeft = filterMoves.findIndex(
								(elem) => elem === "[7,2]"
							);
							if (indexLeft !== -1) {
								allyMoves[JSON.stringify(kingPos)][indexLeft] = null;
							}
						} else if (
							allySide === "B" &&
							JSON.stringify(kingPos) === "[0,4]"
						) {
							const indexRight = filterMoves.findIndex(
								(elem) => elem === "[0,6]"
							);
							if (indexRight !== -1) {
								allyMoves[JSON.stringify(kingPos)][indexRight] = null;
							}
							const indexLeft = filterMoves.findIndex(
								(elem) => elem === "[0,2]"
							);
							if (indexLeft !== -1) {
								allyMoves[JSON.stringify(kingPos)][indexLeft] = null;
							}
						}
						j = moves.length;
						i = enemyKeys.length;
					}
				}
			}
		} else {
			inCheck = true;
		}

		if (Object.keys(allyMoves).length === 0 && inCheck) {
			console.log("CHECKMATE");
			storage.board[kingPos[0]][kingPos[1]].inCheck = true;
			storage.moves = [];
			storage.game_over = true;
		} else if (Object.keys(allyMoves).length === 0 && !inCheck) {
			console.log("STALEMATE");
			storage.moves = [];
			storage.game_over = true;
		} else {
			storage.moves = allyMoves;
			storage.player_turn = storage.opposite_player[storage.player_turn];
		}
	},
	getMoves: () => {
		if (!storage.game_over) {
			moveGenerator.generateAllPossibleMoves();
			moveGenerator.filterIllegalMoves();
			moveGenerator.determineEndGameConditions();
			return storage.moves;
		}
		return [];
	},
	moveGenerationTest: (depth) => {
		if (depth === 0) {
			return 1;
		}
		const moveSet = moveGenerator.getMoves();
		const moveKeys = Object.keys(moveSet);
		let numPositions = 0;

		for (let i = 0; i < moveKeys.length; i++) {
			const startingCoord = JSON.parse(moveKeys[i]);
			const moves = moveSet[moveKeys[i]];
			for (let j = 0; j < moves.length; j++) {
				if (moves[j]) {
					boardSquareModel.movePiece(startingCoord, moves[j]);
					numPositions += moveGenerator.moveGenerationTest(depth - 1);
					boardSquareModel.undoMovePiece();
				}
			}
		}
		return numPositions;
	},
};

export default moveGenerator;
