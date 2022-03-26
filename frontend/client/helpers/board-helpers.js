import storage from "../storage/storage";

export const boardHelpers = {
	resetBoardSquare: (i, j) => {
		storage.board[i][j].pieceId = null;
		storage.board[i][j].pieceSide = null;
		storage.board[i][j].coord = [i, j];
		storage.board[i][j].inCheck = false;
		storage.board[i][j].firstMove = false;
		storage.board[i][j].enPassant = false;
		storage.board[i][j].queenSideCastle = false;
		storage.board[i][j].kingSideCastle = false;
	},
	getKingPos: (side) => {
		let coord = null;

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (
					storage.board[i][j].pieceId === "K" &&
					storage.board[i][j].pieceSide === side
				) {
					coord = [i, j];
					j = 8;
					i = 8;
				}
			}
		}

		return coord;
	},
};

export default boardHelpers;
