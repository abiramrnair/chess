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
};

export default boardHelpers;
