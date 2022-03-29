import m from "mithril";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		storage.player_turn = "W";
		chessBoardModel.initBoardLayout();
		moveGenerator.getMoves();
	},
	view: () => {
		chessBoardModel.convertBoardPositionToFENString();
		return m("div.chess-board-container", chessBoardModel.drawBoard());
	},
};

export default chessBoard;
