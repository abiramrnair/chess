import storage from "../storage/storage";
import m from "mithril";
import boardSquare from "../board-square/board-square";

export const chessBoardModel = {
	initBoardLayout: () => {
		storage.board = [];
		storage.moves = new Array(64).fill(null);
		storage.player_turn = "w";

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
			inCheck: false,
			firstMove: false,
			kingSideCastle: false,
			queenSideCastle: false,
		};
		switch (i) {
			case 1:
			case 6:
				squareInfo.pieceSide = i === 1 ? "b" : "w";
				squareInfo.pieceId = "P";
				break;
			case 0:
			case 7:
				squareInfo.pieceSide = i === 0 ? "b" : "w";
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
		const playerTurn = fenArray[1];
		const castlingRights = fenArray[2].split("");
		const enPassantSquare = fenArray[3].split("");
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
						storage.board[i][j].pieceSide = "w";
						if (storage.board[i][j].pieceId === "K") {
							storage.king_pos["w"] = [i, j];
							if (castlingRights.includes("Q")) {
								storage.board[i][j].queenSideCastle = true;
								storage.board[7][0].firstMove = true;
							} else {
								storage.board[i][j].firstMove = false;
								storage.board[7][0].firstMove = false;
							}
							if (castlingRights.includes("K")) {
								storage.board[i][j].kingSideCastle = true;
								storage.board[7][7].firstMove = true;
							} else {
								storage.board[i][j].firstMove = false;
								storage.board[7][7].firstMove = false;
							}
						}
					} else if (char === char.toLowerCase()) {
						storage.board[i][j].pieceSide = "b";
						if (storage.board[i][j].pieceId === "K") {
							storage.king_pos["b"] = [i, j];
							if (castlingRights.includes("q")) {
								storage.board[i][j].queenSideCastle = true;
								storage.board[0][0].firstMove = true;
							} else {
								storage.board[i][j].firstMove = false;
								storage.board[0][0].firstMove = false;
							}
							if (castlingRights.includes("k")) {
								storage.board[i][j].kingSideCastle = true;
								storage.board[0][7].firstMove = true;
							} else {
								storage.board[i][j].firstMove = false;
								storage.board[0][7].firstMove = false;
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
			storage.en_passant_square = [
				storage.num_row_mapping[enPassantSquare[1]],
				storage.alpha_col_mapping[enPassantSquare[0]],
			];
		} else {
			storage.en_passant_square = [];
		}

		storage.player_turn = playerTurn;
		return chessBoardModel.getEZBoardRepresentation();
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
