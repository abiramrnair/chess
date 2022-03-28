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
import chessBoardModel from "../chess-board/chess-board-model";

export const boardSquareModel = {
	getSquarePieceImage: (i, j) => {
		const square = storage.board[i][j];
		switch (square.pieceId) {
			case "P":
				return square.pieceSide === "W" ? whitePawn : blackPawn;
			case "R":
				return square.pieceSide === "W" ? whiteRook : blackRook;
			case "N":
				return square.pieceSide === "W" ? whiteKnight : blackKnight;
			case "B":
				return square.pieceSide === "W" ? whiteBishop : blackBishop;
			case "Q":
				return square.pieceSide === "W" ? whiteQueen : blackQueen;
			case "K":
				return square.pieceSide === "W" ? whiteKing : blackKing;
			default:
				break;
		}
	},
	getPromotionPieceImage: (i, j, pieceId) => {
		const square = storage.board[i][j];
		switch (pieceId) {
			case "R":
				return square.pieceSide === "W" ? whiteRook : blackRook;
			case "N":
				return square.pieceSide === "W" ? whiteKnight : blackKnight;
			case "B":
				return square.pieceSide === "W" ? whiteBishop : blackBishop;
			case "Q":
				return square.pieceSide === "W" ? whiteQueen : blackQueen;
			default:
				break;
		}
	},
	handleSquareClick: (i, j) => {
		if (
			JSON.stringify([i, j]) === JSON.stringify(storage.selected_square_coord)
		) {
			storage.selected_square_coord = null;
			storage.legal_squares = [];
		} else if (
			storage.player_turn &&
			storage.board[i][j].pieceSide === storage.player_turn
		) {
			storage.selected_square_coord = [i, j];
			storage.legal_squares = [];
			const moves = storage.moves[JSON.stringify([i, j])];
			if (
				(storage.board[i][j].pieceSide === "W" && i === 1) ||
				(storage.board[i][j].pieceSide === "B" && i === 6)
			) {
				if (moves && moves.length) {
					for (let m = 0; m < moves.length; m++) {
						const move = moves[m];
						if (
							!storage.legal_squares.includes(
								JSON.stringify([move[0], move[1]])
							)
						) {
							storage.legal_squares.push(JSON.stringify([move[0], move[1]]));
						}
					}
				}
			} else {
				if (moves && moves.length) {
					for (let i = 0; i < moves.length; i++) {
						storage.legal_squares.push(JSON.stringify(moves[i]));
					}
				}
			}
		} else {
			if (storage.legal_squares.includes(JSON.stringify([i, j]))) {
				if (
					storage.board[storage.selected_square_coord[0]][
						storage.selected_square_coord[1]
					].pieceId === "P" &&
					((storage.board[storage.selected_square_coord[0]][
						storage.selected_square_coord[1]
					].pieceSide === "W" &&
						storage.selected_square_coord[0] === 1) ||
						(storage.board[storage.selected_square_coord[0]][
							storage.selected_square_coord[1]
						].pieceSide === "B" &&
							storage.selected_square_coord[0] === 6))
				) {
					storage.promotion_coord = [i, j];
				} else {
					boardSquareModel.movePiece(storage.selected_square_coord, [i, j]);
					storage.legal_squares = [];
					storage.selected_square_coord = null;
					moveGenerator.getMoves();
				}
			}
		}
	},
	movePiece: (prevCoord, nextCoord) => {
		storage.move_log.push(chessBoardModel.convertBoardPositionToFENString());
		const z = storage.player_turn === "W" ? 1 : -1;
		const castleRow = storage.player_turn === "W" ? 7 : 0;

		if (storage.board[prevCoord[0]][prevCoord[1]].pieceId === "K") {
			if (Math.abs(nextCoord[1] - prevCoord[1]) === 2) {
				if (JSON.stringify(nextCoord) === JSON.stringify([castleRow, 6])) {
					storage.board[castleRow][7].pieceId = null;
					storage.board[castleRow][7].pieceSide = null;
					storage.board[castleRow][7].firstMove = false;
					storage.board[castleRow][5].pieceId = "R";
					storage.board[castleRow][5].pieceSide = storage.player_turn;
					storage.board[castleRow][5].firstMove = false;
				}
				if (JSON.stringify(nextCoord) === JSON.stringify([castleRow, 2])) {
					storage.board[castleRow][0].pieceId = null;
					storage.board[castleRow][0].pieceSide = null;
					storage.board[castleRow][0].firstMove = false;
					storage.board[castleRow][3].pieceId = "R";
					storage.board[castleRow][3].pieceSide = storage.player_turn;
					storage.board[castleRow][3].firstMove = false;
				}
			}
		}

		if (
			storage.board[prevCoord[0]][prevCoord[1]].pieceId === "P" &&
			storage.board[nextCoord[0]][nextCoord[1]].enPassant
		) {
			storage.board[nextCoord[0] + z][nextCoord[1]].pieceId = null;
			storage.board[nextCoord[0] + z][nextCoord[1]].pieceSide = null;
			storage.board[nextCoord[0] + z][nextCoord[1]].coord = [
				nextCoord[0] + z,
				nextCoord[1],
			];
			storage.board[nextCoord[0] + z][nextCoord[1]].inCheck = false;
			storage.board[nextCoord[0] + z][nextCoord[1]].firstMove = false;
			storage.board[nextCoord[0] + z][nextCoord[1]].enPassant = false;
			storage.board[nextCoord[0] + z][nextCoord[1]].queenSideCastle = false;
			storage.board[nextCoord[0] + z][nextCoord[1]].kingSideCastle = false;
		}

		if (
			storage.board[prevCoord[0]][prevCoord[1]].pieceId === "P" &&
			Math.abs(prevCoord[0] - nextCoord[0]) === 2
		) {
			if (storage.board[prevCoord[0]][prevCoord[1]].pieceSide === "W") {
				storage.board[prevCoord[0] - 1][prevCoord[1]].enPassant = true;
			} else {
				storage.board[prevCoord[0] + 1][prevCoord[1]].enPassant = true;
			}
		}

		storage.board[nextCoord[0]][nextCoord[1]] = {
			...storage.board[prevCoord[0]][prevCoord[1]],
			coord: storage.board[nextCoord[0]][nextCoord[1]].coord,
			inCheck: false,
			firstMove: false,
			queenSideCastle: false,
			kingSideCastle: false,
		};

		if (nextCoord[2]) {
			storage.board[nextCoord[0]][nextCoord[1]].pieceId = nextCoord[2];
		}

		boardHelpers.resetBoardSquare(prevCoord[0], prevCoord[1]);
		storage.player_turn = storage.player_turn === "W" ? "B" : "W";
		const enPassantCoord = storage.move_log.length
			? storage.move_log[storage.move_log.length - 1].split(" ")[3].split("")
			: null;
		if (enPassantCoord && enPassantCoord[0] !== "-") {
			storage.board[Number(enPassantCoord[0])][
				Number(enPassantCoord[1])
			].enPassant = false;
		}
	},
	undoMovePiece: () => {
		storage.game_over = false;
		const lastBoardState = storage.move_log.pop();
		storage.legal_squares = [];
		chessBoardModel.convertFENStringToBoardPosition(lastBoardState);
	},
};

export default boardSquareModel;
