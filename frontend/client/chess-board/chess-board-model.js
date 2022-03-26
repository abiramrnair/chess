import storage from "../storage/storage";
import m from "mithril";
import boardSquare from "../board-square/board-square";

export const chessBoardModel = {
	initBoardLayout: () => {
		storage.board = [];
		for (let i = 0; i < 8; i++) {
			const row = [];
			for (let j = 0; j < 8; j++) {
				const squareInfo = chessBoardModel.getInitialBoardInfo(i, j);
				row.push(squareInfo);
			}
			storage.board.push(row);
		}
	},
	getInitialBoardInfo: (i, j) => {
		const squareInfo = {
			pieceId: null,
			pieceSide: null,
			coord: [i, j],
			enPassant: false,
			inCheck: false,
			firstMove: false,
			queenSideCastle: false,
			kingSideCastle: false,
		};
		switch (i) {
			case 1:
			case 6:
				squareInfo.pieceSide = i === 1 ? "B" : "W";
				squareInfo.pieceId = "P";
				break;
			case 0:
			case 7:
				squareInfo.pieceSide = i === 0 ? "B" : "W";
				switch (j) {
					case 0:
					case 7:
						squareInfo.pieceId = "R";
						break;
					case 1:
					case 6:
						squareInfo.pieceId = "N";
						break;
					case 2:
					case 5:
						squareInfo.pieceId = "B";
						break;
					case 3:
						squareInfo.pieceId = "Q";
						break;
					case 4:
						squareInfo.pieceId = "K";
						break;
				}
		}
		squareInfo.pieceId
			? (squareInfo.firstMove = true)
			: (squareInfo.firstMove = false);
		return squareInfo;
	},
	getEZBoardRepresentation: () => {
		// gets current board state in easy to read console log format
		const testArray = [];
		for (let i = 0; i < 8; i++) {
			const row = [];
			for (let j = 0; j < 8; j++) {
				const side = storage.board[i][j].pieceSide;
				const piece = storage.board[i][j].pieceId;
				if (piece) {
					row.push(`${side.toLowerCase()}${piece}`);
				} else {
					row.push("");
				}
			}
			testArray.push(row);
		}
		return testArray;
	},
	convertFENStringToBoardPosition: (fenString) => {
		const fenArray = fenString.split(" ");
		const charPositions = fenArray[0].split("/");
		const playerTurn = fenArray[1].toUpperCase();
		const castlingRights = fenArray[2].split("");
		const enPassantSquare = fenArray[3].split("");
		const kingFirstMove = fenArray[4].split("");
		const linearArray = [];

		// Get char positions
		for (let i = 0; i < charPositions.length; i++) {
			const segment = charPositions[i];
			for (let j = 0; j < segment.length; j++) {
				const num = Number(segment[j]);
				if (Number.isInteger(num)) {
					for (let k = 0; k < num; k++) {
						linearArray.push("");
					}
				} else {
					linearArray.push(segment[j]);
				}
			}
		}

		let counter = 0;

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const char = linearArray[counter];
				if (char.length) {
					storage.board[i][j].pieceId = char.toUpperCase();
					if (char === char.toUpperCase()) {
						storage.board[i][j].pieceSide = "W";
						if (storage.board[i][j].pieceId === "K") {
							if (castlingRights.includes("Q")) {
								storage.board[i][j].queenSideCastle = true;
							}
							if (castlingRights.includes("K")) {
								storage.board[i][j].kingSideCastle = true;
							}
							if (kingFirstMove.includes("K")) {
								storage.board[i][j].firstMove = true;
							}
						}
					} else if (char === char.toLowerCase()) {
						storage.board[i][j].pieceSide = "B";
						if (storage.board[i][j].pieceId === "K") {
							if (castlingRights.includes("q")) {
								storage.board[i][j].queenSideCastle = true;
							}
							if (castlingRights.includes("k")) {
								storage.board[i][j].kingSideCastle = true;
							}
							if (kingFirstMove.includes("k")) {
								storage.board[i][j].firstMove = true;
							}
						}
					}
				} else {
					storage.board[i][j].pieceId = null;
					storage.board[i][j].pieceSide = null;
					storage.board[i][j].enPassant = false;
					storage.board[i][j].firstMove = false;
					storage.board[i][j].inCheck = false;
					storage.board[i][j].queenSideCastle = false;
					storage.board[i][j].kingSideCastle = false;
				}
				counter += 1;
			}
		}

		if (enPassantSquare[0] !== "-") {
			storage.board[Number(enPassantSquare[0])][
				Number(enPassantSquare[1])
			].enPassant = true;
		}

		storage.player_turn = playerTurn;
		return chessBoardModel.getEZBoardRepresentation();
	},
	convertBoardPositionToFENString: () => {
		const fen_array = [];
		let en_passant = "-";
		const player_turn = storage.player_turn;
		let whiteKingSideCastle = false;
		let whiteQueenSideCastle = false;
		let blackKingSideCastle = false;
		let blackQueenSideCastle = false;
		let whiteKingFirstMove = false;
		let blackKingFirstMove = false;

		for (let i = 0; i < 8; i++) {
			let counter = 0;
			for (let j = 0; j < 8; j++) {
				if (storage.board[i][j].pieceId) {
					if (counter > 0) {
						fen_array.push(String(counter));
					}
					counter = 0;
					if (storage.board[i][j].pieceSide === "B") {
						fen_array.push(storage.board[i][j].pieceId.toLowerCase());
						if (storage.board[i][j].kingSideCastle) {
							blackKingSideCastle = "k";
						}
						if (storage.board[i][j].queenSideCastle) {
							blackQueenSideCastle = "q";
						}
						if (
							storage.board[i][j].pieceId === "K" &&
							storage.board[i][j].firstMove
						) {
							blackKingFirstMove = "k";
						}
						if (storage.board[i][j].pieceId === "K") {
							storage.king_pos["B"] = [i, j];
						}
					} else {
						fen_array.push(storage.board[i][j].pieceId);
						if (storage.board[i][j].kingSideCastle) {
							whiteKingSideCastle = "K";
						}
						if (storage.board[i][j].queenSideCastle) {
							whiteQueenSideCastle = "Q";
						}
						if (
							storage.board[i][j].pieceId === "K" &&
							storage.board[i][j].firstMove
						) {
							whiteKingFirstMove = "K";
						}
						if (storage.board[i][j].pieceId === "K") {
							storage.king_pos["W"] = [i, j];
						}
					}
				} else {
					counter += 1;
				}
				if (storage.board[i][j].enPassant) {
					en_passant = `${i}${j}`;
				}
			}
			if (counter > 0) {
				fen_array.push(String(counter));
			}
			counter = 0;
			if (i !== 7) {
				fen_array.push("/");
			}
		}

		const castlingRights =
			!whiteKingSideCastle &&
			!whiteQueenSideCastle &&
			!blackKingSideCastle &&
			!blackQueenSideCastle
				? "-"
				: [
						whiteKingSideCastle ? whiteKingSideCastle : "",
						whiteQueenSideCastle ? whiteQueenSideCastle : "",
						blackKingSideCastle ? blackKingSideCastle : "",
						blackQueenSideCastle ? blackQueenSideCastle : "",
				  ].join("");

		const kingFirstMove =
			!whiteKingFirstMove && !blackKingFirstMove
				? "-"
				: [
						whiteKingFirstMove ? whiteKingFirstMove : "",
						blackKingFirstMove ? blackKingFirstMove : "",
				  ].join("");

		const otherChars = [
			" ",
			player_turn.toLowerCase(),
			" ",
			castlingRights,
			" ",
			en_passant,
			" ",
			kingFirstMove,
		];
		const fenString = fen_array.concat(otherChars).join("");
		return fenString;
	},
	drawBoard: () => {
		return storage.board.map((row) => {
			return m(
				"div.chess-board-row",
				row.map((square) => {
					return m(boardSquare, { squareInfo: square });
				})
			);
		});
	},
};

export default chessBoardModel;
