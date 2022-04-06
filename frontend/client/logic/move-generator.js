import m from "mithril";
import boardSquareModel from "../board-square/board-square-model";
import bot from "../bot/bot";
import boardHelpers from "../helpers/board-helpers";
import storage from "../storage/storage";
const _ = require("lodash");

export const moveGenerator = {
	generateAllPossibleMoves: () => {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)] = [];
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
		return storage.moves;
	},
	generateAllPawnMoves: (i, j) => {
		const z = storage.board[i][j].pieceSide === "w" ? -1 : 1;
		const opposite_player = storage.board[i][j].pieceSide === "w" ? "b" : "w";

		// single square
		if (i + z >= 0 && i + z < 8 && !storage.board[i + z][j].pieceId) {
			if (
				(storage.board[i][j].pieceSide === "w" && i === 1) ||
				(storage.board[i][j].pieceSide === "b" && i === 6)
			) {
				for (let p = 0; p < storage.promotion_pieces.length; p++) {
					storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
						i + z,
						j,
						storage.promotion_pieces[p],
					]);
				}
			} else {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i + z, j]);
			}
		}

		// Diagonal captures
		if (i + z >= 0 && i + z < 8) {
			if (
				j + 1 < 8 &&
				storage.board[i + z][j + 1].pieceSide === opposite_player
			) {
				if (
					(storage.board[i][j].pieceSide === "w" && i === 1) ||
					(storage.board[i][j].pieceSide === "b" && i === 6)
				) {
					for (let p = 0; p < storage.promotion_pieces.length; p++) {
						storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
							i + z,
							j + 1,
							storage.promotion_pieces[p],
						]);
					}
				} else {
					storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
						i + z,
						j + 1,
					]);
				}
			}
			if (
				j + 1 < 8 &&
				!storage.board[i + z][j + 1].pieceSide &&
				boardHelpers.checkTwoCoordsEqual(storage.en_passant_square, [
					i + z,
					j + 1,
				])
			) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i + z,
					j + 1,
				]);
			}
			if (
				j - 1 >= 0 &&
				storage.board[i + z][j - 1].pieceSide === opposite_player
			) {
				if (
					(storage.board[i][j].pieceSide === "w" && i === 1) ||
					(storage.board[i][j].pieceSide === "b" && i === 6)
				) {
					for (let p = 0; p < storage.promotion_pieces.length; p++) {
						storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
							i + z,
							j - 1,
							storage.promotion_pieces[p],
						]);
					}
				} else {
					storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
						i + z,
						j - 1,
					]);
				}
			}
			if (
				j - 1 >= 0 &&
				!storage.board[i + z][j - 1].pieceSide &&
				boardHelpers.checkTwoCoordsEqual(storage.en_passant_square, [
					i + z,
					j - 1,
				])
			) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i + z,
					j - 1,
				]);
			}
		}

		// two squares if first move
		if (
			i + 2 * z >= 0 &&
			i + 2 * z < 8 &&
			!storage.board[i + 1 * z][j].pieceId &&
			!storage.board[i + 2 * z][j].pieceId &&
			((storage.board[i][j].pieceSide === "w" && i === 6) ||
				(storage.board[i][j].pieceSide === "b" && i === 1))
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 2 * z,
				j,
			]);
		}
	},
	generateAllRookMoves: (i, j) => {
		const opposite_player = storage.board[i][j].pieceSide === "w" ? "b" : "w";
		let z = 1;

		while (
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i][j + z].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j + z]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j - z]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i + z, j]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i - z, j]);
			if (storage.board[i - z][j].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
	},
	generateAllKnightMoves: (i, j) => {
		if (
			i + 1 < 8 &&
			j + 2 < 8 &&
			storage.board[i + 1][j + 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 1,
				j + 2,
			]);
		}
		if (
			i + 1 < 8 &&
			j - 2 >= 0 &&
			storage.board[i + 1][j - 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 1,
				j - 2,
			]);
		}
		if (
			i - 1 >= 0 &&
			j + 2 < 8 &&
			storage.board[i - 1][j + 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 1,
				j + 2,
			]);
		}
		if (
			i - 1 >= 0 &&
			j - 2 >= 0 &&
			storage.board[i - 1][j - 2].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 1,
				j - 2,
			]);
		}
		if (
			i + 2 < 8 &&
			j + 1 < 8 &&
			storage.board[i + 2][j + 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 2,
				j + 1,
			]);
		}
		if (
			i + 2 < 8 &&
			j - 1 >= 0 &&
			storage.board[i + 2][j - 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 2,
				j - 1,
			]);
		}
		if (
			i - 2 >= 0 &&
			j + 1 < 8 &&
			storage.board[i - 2][j + 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 2,
				j + 1,
			]);
		}
		if (
			i - 2 >= 0 &&
			j - 1 >= 0 &&
			storage.board[i - 2][j - 1].pieceSide !== storage.board[i][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 2,
				j - 1,
			]);
		}
	},
	generateAllBishopMoves: (i, j) => {
		const opposite_player = storage.board[i][j].pieceSide === "w" ? "b" : "w";
		let z = 1;

		while (
			i + z < 8 &&
			j + z < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + z][j + z].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + z,
				j + z,
			]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - z,
				j + z,
			]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + z,
				j - z,
			]);
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
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - z,
				j - z,
			]);
			if (storage.board[i - z][j - z].pieceSide === opposite_player) {
				break;
			}
			z += 1;
		}
	},
	generateAllQueenMoves: (i, j, pieceSide) => {
		const opposite_player = !pieceSide
			? storage.board[i][j].pieceSide === "w"
				? "b"
				: "w"
			: pieceSide;
		let z = 1;

		while (
			i + z < 8 &&
			j + z < 8 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i + z][j + z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i + z,
					j + z,
				]);
			}

			if (storage.board[i + z][j + z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i + z, j + z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j + z < 8 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i - z][j + z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i - z,
					j + z,
				]);
			}

			if (storage.board[i - z][j + z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i - z, j + z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			j - z >= 0 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i + z][j - z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i + z,
					j - z,
				]);
			}

			if (storage.board[i + z][j - z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i + z, j - z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			j - z >= 0 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i - z][j - z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
					i - z,
					j - z,
				]);
			}

			if (storage.board[i - z][j - z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i - z, j - z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			j + z < 8 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i][j + z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j + z]);
			}

			if (storage.board[i][j + z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i, j + z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			j - z >= 0 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i][j - z].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j - z]);
			}

			if (storage.board[i][j - z].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i, j - z]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i + z < 8 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i + z][j].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i + z, j]);
			}

			if (storage.board[i + z][j].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i + z, j]);
				}
				break;
			}
			z += 1;
		}
		z = 1;
		while (
			i - z >= 0 &&
			(pieceSide ||
				storage.board[i][j].pieceSide !== storage.board[i - z][j].pieceSide)
		) {
			if (!pieceSide) {
				storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i - z, j]);
			}

			if (storage.board[i - z][j].pieceSide === opposite_player) {
				if (pieceSide) {
					storage.king_neighbours.push([i - z, j]);
				}
				break;
			}
			z += 1;
		}
	},
	generateAllKingMoves: (i, j) => {
		if (
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i][j + 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j + 1]);
		}
		if (
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i][j - 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i, j - 1]);
		}
		if (
			i + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i + 1, j]);
		}
		if (
			i - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([i - 1, j]);
		}
		if (
			i + 1 < 8 &&
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j + 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 1,
				j + 1,
			]);
		}
		if (
			i - 1 >= 0 &&
			j + 1 < 8 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j + 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 1,
				j + 1,
			]);
		}
		if (
			i + 1 < 8 &&
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i + 1][j - 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i + 1,
				j - 1,
			]);
		}
		if (
			i - 1 >= 0 &&
			j - 1 >= 0 &&
			storage.board[i][j].pieceSide !== storage.board[i - 1][j - 1].pieceSide
		) {
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].push([
				i - 1,
				j - 1,
			]);
		}

		if (!storage.board[i][j].inCheck) {
			if (
				boardHelpers.checkTwoCoordsEqual([7, 4], [i, j]) &&
				storage.board[i][j].firstMove
			) {
				if (
					!storage.board[7][5].pieceId &&
					!storage.board[7][6].pieceId &&
					storage.board[7][7].pieceId === "R" &&
					storage.board[7][7].firstMove &&
					storage.board[7][7].pieceSide === "w"
				) {
					storage.board[i][j].kingSideCastle = true;
				} else {
					storage.board[i][j].kingSideCastle = false;
				}
				if (
					!storage.board[7][3].pieceId &&
					!storage.board[7][2].pieceId &&
					!storage.board[7][1].pieceId &&
					storage.board[7][0].pieceId === "R" &&
					storage.board[7][0].firstMove &&
					storage.board[7][0].pieceSide === "w"
				) {
					storage.board[i][j].queenSideCastle = true;
				} else {
					storage.board[i][j].queenSideCastle = false;
				}
			} else if (
				boardHelpers.checkTwoCoordsEqual([0, 4], [i, j]) &&
				storage.board[i][j].firstMove
			) {
				if (
					!storage.board[0][5].pieceId &&
					!storage.board[0][6].pieceId &&
					storage.board[0][7].pieceId === "R" &&
					storage.board[0][7].firstMove &&
					storage.board[0][7].pieceSide === "b"
				) {
					storage.board[i][j].kingSideCastle = true;
				} else {
					storage.board[i][j].kingSideCastle = false;
				}
				if (
					!storage.board[0][3].pieceId &&
					!storage.board[0][2].pieceId &&
					!storage.board[0][1].pieceId &&
					storage.board[0][0].pieceId === "R" &&
					storage.board[0][0].firstMove &&
					storage.board[0][0].pieceSide === "b"
				) {
					storage.board[i][j].queenSideCastle = true;
				} else {
					storage.board[i][j].queenSideCastle = false;
				}
			}
		}
	},
	filterIllegalMoves: () => {
		storage.king_neighbours = [];
		const currentKingPos = storage.king_pos[storage.player_turn];
		let inCheck = false;
		moveGenerator.generateAllQueenMoves(
			storage.king_pos[storage.player_turn][0],
			storage.king_pos[storage.player_turn][1],
			storage.player_turn
		);
		storage.board[currentKingPos[0]][currentKingPos[1]].inCheck = false;
		storage.king_neighbours.push(storage.king_pos[storage.player_turn]);
		const allyMoves = [];
		for (let i = 0; i < storage.moves.length; i++) {
			allyMoves.push(storage.moves[i]);
		}
		const enemyMoves = [];
		storage.player_turn = storage.opposite_player[storage.player_turn];
		moveGenerator.generateAllPossibleMoves();
		for (let i = 0; i < storage.moves.length; i++) {
			enemyMoves.push(storage.moves[i]);
		}
		storage.player_turn = storage.opposite_player[storage.player_turn];
		for (let i = 0; i < enemyMoves.length; i++) {
			for (let j = 0; j < enemyMoves[i].length; j++) {
				if (
					boardHelpers.checkTwoCoordsEqual(enemyMoves[i][j], currentKingPos)
				) {
					inCheck = true;
					i = enemyMoves.length;
					break;
				}
			}
		}
		let canKingSideCastle = true;
		let canQueenSideCastle = true;
		if (!inCheck) {
			for (let i = 0; i < storage.king_neighbours.length; i++) {
				const startingCoord = storage.king_neighbours[i];
				const moves =
					allyMoves[
						boardHelpers.getCoordToLinearNum(startingCoord[0], startingCoord[1])
					];
				for (let j = 0; j < moves.length; j++) {
					boardSquareModel.movePiece(startingCoord, moves[j]);
					const enemyMoveSet = moveGenerator.generateAllPossibleMoves();
					for (let k = 0; k < enemyMoveSet.length; k++) {
						const enemyMoves = enemyMoveSet[k];
						for (let z = 0; z < enemyMoves.length; z++) {
							if (
								boardHelpers.checkTwoCoordsEqual(
									enemyMoves[z],
									storage.king_pos[storage.opposite_player[storage.player_turn]]
								)
							) {
								if (
									boardHelpers.checkTwoCoordsEqual(enemyMoves[z], [
										currentKingPos[0],
										5,
									])
								) {
									canKingSideCastle = false;
								}
								if (
									boardHelpers.checkTwoCoordsEqual(enemyMoves[z], [
										currentKingPos[0],
										3,
									])
								) {
									canQueenSideCastle = false;
								}
								moves[j] = null;
							}
						}
					}
					boardSquareModel.undoMovePiece();
				}
			}
			if (
				storage.board[currentKingPos[0]][currentKingPos[1]].kingSideCastle ||
				storage.board[currentKingPos[0]][currentKingPos[1]].queenSideCastle
			) {
				for (let i = 0; i < enemyMoves.length; i++) {
					const moves = enemyMoves[i];
					for (let j = 0; j < moves.length; j++) {
						if (
							storage.board[currentKingPos[0]][currentKingPos[1]].kingSideCastle
						) {
							if (
								boardHelpers.checkTwoCoordsEqual(moves[j], [
									currentKingPos[0],
									5,
								]) ||
								boardHelpers.checkTwoCoordsEqual(moves[j], [
									currentKingPos[0],
									6,
								])
							) {
								storage.board[currentKingPos[0]][
									currentKingPos[1]
								].kingSideCastle = false;
							}
						}
						if (
							storage.board[currentKingPos[0]][currentKingPos[1]]
								.queenSideCastle
						) {
							if (
								boardHelpers.checkTwoCoordsEqual(moves[j], [
									currentKingPos[0],
									3,
								]) ||
								boardHelpers.checkTwoCoordsEqual(moves[j], [
									currentKingPos[0],
									2,
								])
							) {
								storage.board[currentKingPos[0]][
									currentKingPos[1]
								].queenSideCastle = false;
							}
						}
					}
				}
				if (
					storage.board[currentKingPos[0]][currentKingPos[1]].kingSideCastle &&
					canKingSideCastle
				) {
					allyMoves[
						boardHelpers.getCoordToLinearNum(
							currentKingPos[0],
							currentKingPos[1]
						)
					].push([currentKingPos[0], 6]);
				}
				if (
					storage.board[currentKingPos[0]][currentKingPos[1]].queenSideCastle &&
					canQueenSideCastle
				) {
					allyMoves[
						boardHelpers.getCoordToLinearNum(
							currentKingPos[0],
							currentKingPos[1]
						)
					].push([currentKingPos[0], 2]);
				}
			}
		} else {
			for (let i = 0; i < allyMoves.length; i++) {
				const startingCoord = boardHelpers.getLinearNumToCoord(i);
				const moves = allyMoves[i];
				for (let j = 0; j < moves.length; j++) {
					boardSquareModel.movePiece(startingCoord, moves[j]);
					const enemyMoveSet = moveGenerator.generateAllPossibleMoves();
					for (let k = 0; k < enemyMoveSet.length; k++) {
						const enemyMoves = enemyMoveSet[k];
						for (let z = 0; z < enemyMoves.length; z++) {
							if (
								boardHelpers.checkTwoCoordsEqual(
									enemyMoves[z],
									storage.king_pos[storage.opposite_player[storage.player_turn]]
								)
							) {
								moves[j] = null;
							}
						}
					}
					boardSquareModel.undoMovePiece();
				}
			}
		}
		storage.moves = allyMoves;
	},
	getMoves: (captureMovesOnly) => {
		moveGenerator.generateAllPossibleMoves();
		moveGenerator.filterIllegalMoves();
		const moves = [];
		for (let i = 0; i < storage.moves.length; i++) {
			const startingCoord = boardHelpers.getLinearNumToCoord(i);
			const possibleMoves = storage.moves[i];
			for (let j = 0; j < possibleMoves.length; j++) {
				if (possibleMoves[j]) {
					if (!captureMovesOnly) {
						moves.push([
							startingCoord,
							possibleMoves[j],
							bot.getMoveScore([startingCoord, possibleMoves[j]]),
						]);
					} else {
						if (
							storage.board[possibleMoves[j][0]][possibleMoves[j][1]].pieceId
						) {
							moves.push([
								startingCoord,
								possibleMoves[j],
								bot.getMoveScore([startingCoord, possibleMoves[j]]),
							]);
						}
					}
				}
			}
		}
		if (
			moves.length === 0 &&
			storage.board[storage.king_pos[storage.player_turn][0]][
				storage.king_pos[storage.player_turn][1]
			].inCheck
		) {
			storage.check_mate = true;
		} else if (
			moves.length === 0 &&
			!storage.board[storage.king_pos[storage.player_turn][0]][
				storage.king_pos[storage.player_turn][1]
			].inCheck
		) {
			storage.stale_mate = true;
		}
		moves.sort((a, b) => {
			if (a[2] < b[2]) {
				return 1;
			}
			if (b[2] < a[2]) {
				return -1;
			}
			return 0;
		});
		return moves;
	},
	moveGenerationTest: (depth) => {
		if (depth === 0) {
			return 1;
		}
		const moveSet = moveGenerator.getMoves();
		let numPositions = 0;
		for (let i = 0; i < moveSet.length; i++) {
			const startingCoord = moveSet[i][0];
			const move = moveSet[i][1];
			boardSquareModel.movePiece(startingCoord, move);
			numPositions += moveGenerator.moveGenerationTest(depth - 1);
			boardSquareModel.undoMovePiece();
		}
		return numPositions;
	},
};

export default moveGenerator;
