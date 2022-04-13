import m from "mithril";
import bot from "../bot/bot";
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
	onupdate: () => {
		const possibleMoves = moveGenerator.getMoves();
		if (
			storage.bot_players[storage.player_turn] &&
			possibleMoves.length &&
			!storage.menu_open
		) {
			setTimeout(() => {
				bot.makeBotMove(storage.bot_depth);
			}, 500);
		}
	},
};

export default chessBoard;
