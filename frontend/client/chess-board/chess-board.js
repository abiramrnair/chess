import m from "mithril";
import bot from "../bot/bot";
import boardHelpers from "../helpers/board-helpers";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		chessBoardModel.initBoardLayout();
		moveGenerator.getMoves();
	},
	view: () => {
		// if (
		// 	storage.bot_players[storage.player_turn] &&
		// 	(!storage.check_mate || !storage.stale_mate)
		// ) {
		// 	moveGenerator.getMoves();
		// 	setTimeout(() => {
		// 		m.redraw();
		// 		bot.makeBotMove(3);
		// 	}, 1000);
		// }
		return m("div.chess-board-container", chessBoardModel.drawBoard());
	},
};

export default chessBoard;
