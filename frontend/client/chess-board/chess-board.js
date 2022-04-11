import m from "mithril";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		chessBoardModel.initBoardLayout();
		moveGenerator.getMoves();
	},
	view: () => {
		return m(
			`div.chess-board-container${
				storage.board_perspective === "b" ? ".rotated" : ""
			}`,
			chessBoardModel.drawBoard()
		);
	},
};

export default chessBoard;
