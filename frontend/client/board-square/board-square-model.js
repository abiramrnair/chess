import storage from "../storage/storage";
import whitePawn from "../assets/pieces/pawn.png";
import blackPawn from "../assets/pieces/_pawn.png";
import whiteRook from "../assets/pieces/rook.png";
import blackRook from "../assets/pieces/_rook.png";
import whiteKnight from "../assets/pieces/knight.png";
import blackKnight from "../assets/pieces/_knight.png";
import whiteBishop from "../assets/pieces/bishop.png";
import blackBishop from "../assets/pieces/_bishop.png";
import whiteQueen from "../assets/pieces/queen.png";
import blackQueen from "../assets/pieces/_queen.png";
import whiteKing from "../assets/pieces/king.png";
import blackKing from "../assets/pieces/_king.png";
import boardHelpers from "../helpers/board-helpers";
import moveGenerator from "../logic/move-generator";
import m from "mithril";
import bot from "../bot/bot";

export const boardSquareModel = {
	getSquarePieceImage: (i, j) => {
		const square = storage.board[i][j];
		switch (square.pieceId) {
			case "P":
				return square.pieceSide === "w" ? whitePawn : blackPawn;
			case "R":
				return square.pieceSide === "w" ? whiteRook : blackRook;
			case "N":
				return square.pieceSide === "w" ? whiteKnight : blackKnight;
			case "B":
				return square.pieceSide === "w" ? whiteBishop : blackBishop;
			case "Q":
				return square.pieceSide === "w" ? whiteQueen : blackQueen;
			case "K":
				return square.pieceSide === "w" ? whiteKing : blackKing;
			default:
				break;
		}
	},
	getPromotionPieceImage: (i, j, pieceId) => {
		const square = storage.board[i][j];
		switch (pieceId) {
			case "R":
				return square.pieceSide === "w" ? whiteRook : blackRook;
			case "N":
				return square.pieceSide === "w" ? whiteKnight : blackKnight;
			case "B":
				return square.pieceSide === "w" ? whiteBishop : blackBishop;
			case "Q":
				return square.pieceSide === "w" ? whiteQueen : blackQueen;
			default:
				break;
		}
	},
	handleSquareClick: (i, j) => {
		if (
			!storage.selected_square_coord &&
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)] &&
			storage.moves[boardHelpers.getCoordToLinearNum(i, j)].length
		) {
			storage.selected_square_coord = [i, j];
			storage.legal_squares = storage.moves[
				boardHelpers.getCoordToLinearNum(i, j)
			].map((coord) => boardHelpers.stringifyCoord(coord));
		} else if (
			storage.selected_square_coord &&
			boardHelpers.checkTwoCoordsEqual(storage.selected_square_coord, [i, j])
		) {
			storage.selected_square_coord = null;
			storage.legal_squares = [];
		} else {
			let possibleMoves = [];
			if (storage.legal_squares.includes(boardHelpers.stringifyCoord([i, j]))) {
				if (
					storage.board[storage.selected_square_coord[0]][
						storage.selected_square_coord[1]
					].pieceId === "P" &&
					((storage.board[storage.selected_square_coord[0]][
						storage.selected_square_coord[1]
					].pieceSide === "w" &&
						storage.selected_square_coord[0] === 1) ||
						(storage.board[storage.selected_square_coord[0]][
							storage.selected_square_coord[1]
						].pieceSide === "b" &&
							storage.selected_square_coord[0] === 6))
				) {
					storage.promotion_coord = [i, j];
				} else {
					const moveIndex = storage.legal_squares.findIndex(
						(coord) => coord === boardHelpers.stringifyCoord([i, j])
					);
					boardSquareModel.movePiece(
						storage.selected_square_coord,
						boardHelpers.parseCoordString(storage.legal_squares[moveIndex])
					);
					storage.selected_square_coord = null;
					storage.legal_squares = [];
					possibleMoves = moveGenerator.getMoves();
				}
				if (storage.bot_players[storage.player_turn] && possibleMoves.length) {
					setTimeout(() => {
						bot.makeBotMove(5);
					}, 500);
				}
			}
		}
	},
	movePiece: (prevCoord, nextCoord) => {
		storage.move_log.push([
			{ ...storage.board[prevCoord[0]][prevCoord[1]] },
			{ ...storage.board[nextCoord[0]][nextCoord[1]] },
			storage.en_passant_square,
		]);
		const enPassantSquare = storage.en_passant_square;
		storage.en_passant_square = [];
		if (storage.board[prevCoord[0]][prevCoord[1]].pieceId === "K") {
			storage.king_pos[storage.board[prevCoord[0]][prevCoord[1]].pieceSide] =
				nextCoord;
			if (prevCoord[1] - nextCoord[1] === 2) {
				storage.board[prevCoord[0]][0].pieceId = null;
				storage.board[prevCoord[0]][0].pieceSide = null;
				storage.board[prevCoord[0]][0].firstMove = null;
				storage.board[prevCoord[0]][3].pieceId = "R";
				storage.board[prevCoord[0]][3].pieceSide =
					storage.board[prevCoord[0]][prevCoord[1]].pieceSide;
				storage.board[prevCoord[0]][3].firstMove = false;
				//storage.castles += 1;
			}
			if (prevCoord[1] - nextCoord[1] === -2) {
				storage.board[prevCoord[0]][7].pieceId = null;
				storage.board[prevCoord[0]][7].pieceSide = null;
				storage.board[prevCoord[0]][7].firstMove = null;
				storage.board[prevCoord[0]][5].pieceId = "R";
				storage.board[prevCoord[0]][5].pieceSide =
					storage.board[prevCoord[0]][prevCoord[1]].pieceSide;
				storage.board[prevCoord[0]][5].firstMove = false;
				//storage.castles += 1;
			}
		}
		if (storage.board[prevCoord[0]][prevCoord[1]].pieceId === "P") {
			if (Math.abs(prevCoord[0] - nextCoord[0]) === 2) {
				// setting en passant
				if (storage.board[prevCoord[0]][prevCoord[1]].pieceSide === "w") {
					storage.en_passant_square = [nextCoord[0] + 1, nextCoord[1]];
				} else {
					storage.en_passant_square = [nextCoord[0] - 1, nextCoord[1]];
				}
			}
			if (boardHelpers.checkTwoCoordsEqual(enPassantSquare, nextCoord)) {
				//storage.eps += 1;
				// making en passant move
				if (storage.board[prevCoord[0]][prevCoord[1]].pieceSide === "w") {
					storage.board[enPassantSquare[0] + 1][enPassantSquare[1]].pieceId =
						null;
					storage.board[enPassantSquare[0] + 1][enPassantSquare[1]].pieceSide =
						null;
					storage.board[enPassantSquare[0] + 1][
						enPassantSquare[1]
					].firstMove = false;
				} else {
					storage.board[enPassantSquare[0] - 1][enPassantSquare[1]].pieceId =
						null;
					storage.board[enPassantSquare[0] - 1][enPassantSquare[1]].pieceSide =
						null;
					storage.board[enPassantSquare[0] - 1][
						enPassantSquare[1]
					].firstMove = false;
				}
			}
		}
		storage.board[nextCoord[0]][nextCoord[1]] = {
			...storage.board[prevCoord[0]][prevCoord[1]],
			coord: [nextCoord[0], nextCoord[1]],
			firstMove: false,
			inCheck: false,
			kingSideCastle: false,
			queenSideCastle: false,
		};
		if (nextCoord[2]) {
			storage.board[nextCoord[0]][nextCoord[1]].pieceId = nextCoord[2];
		}
		storage.board[prevCoord[0]][prevCoord[1]].pieceId = null;
		storage.board[prevCoord[0]][prevCoord[1]].pieceSide = null;
		storage.board[prevCoord[0]][prevCoord[1]].firstMove = false;
		storage.board[prevCoord[0]][prevCoord[1]].inCheck = false;
		storage.board[prevCoord[0]][prevCoord[1]].kingSideCastle = false;
		storage.board[prevCoord[0]][prevCoord[1]].queenSideCastle = false;
		storage.player_turn = storage.opposite_player[storage.player_turn];
	},
	undoMovePiece: () => {
		const moveSet = storage.move_log.pop();
		const squareOne = moveSet[0];
		const squareTwo = moveSet[1];
		const enPassant = moveSet[2];

		if (squareOne.pieceId === "K") {
			storage.king_pos[squareOne.pieceSide] = squareOne.coord;
			if (squareOne.coord[1] - squareTwo.coord[1] === -2) {
				storage.board[squareOne.coord[0]][5].pieceId = null;
				storage.board[squareOne.coord[0]][5].pieceSide = null;
				storage.board[squareOne.coord[0]][5].firstMove = false;
				storage.board[squareOne.coord[0]][7].pieceId = "R";
				storage.board[squareOne.coord[0]][7].pieceSide = squareOne.pieceSide;
				storage.board[squareOne.coord[0]][7].firstMove = true;
			} else if (squareOne.coord[1] - squareTwo.coord[1] === 2) {
				storage.board[squareOne.coord[0]][3].pieceId = null;
				storage.board[squareOne.coord[0]][3].pieceSide = null;
				storage.board[squareOne.coord[0]][3].firstMove = false;
				storage.board[squareOne.coord[0]][0].pieceId = "R";
				storage.board[squareOne.coord[0]][0].pieceSide = squareOne.pieceSide;
				storage.board[squareOne.coord[0]][0].firstMove = true;
			}
		}
		if (enPassant.length) {
			if (enPassant[0] === 2) {
				storage.board[enPassant[0] + 1][enPassant[1]].pieceId = "P";
				storage.board[enPassant[0] + 1][enPassant[1]].pieceSide = "b";
			} else if (enPassant[0] === 5) {
				storage.board[enPassant[0] - 1][enPassant[1]].pieceId = "P";
				storage.board[enPassant[0] - 1][enPassant[1]].pieceSide = "w";
			}
		}

		storage.board[squareOne.coord[0]][squareOne.coord[1]] = squareOne;
		storage.board[squareTwo.coord[0]][squareTwo.coord[1]] = squareTwo;
		storage.en_passant_square = enPassant;
		if (storage.check_mate || storage.stale_mate) {
			storage.check_mate = false;
			storage.stale_mate = false;
		}
		storage.player_turn = storage.opposite_player[storage.player_turn];
	},
};

export default boardSquareModel;
