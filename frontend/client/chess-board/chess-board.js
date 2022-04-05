import m from "mithril";
import moveGenerator from "../logic/move-generator";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		chessBoardModel.initBoardLayout();
		moveGenerator.getMoves();
	},
	view: () => {
		return m("div.chess-board-container", chessBoardModel.drawBoard());
	},
};

export default chessBoard;
