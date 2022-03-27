import m from "mithril";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		storage.player_turn = "W";
		chessBoardModel.initBoardLayout();
		moveGenerator.getMoves();
		// chessBoardModel.convertFENStringToBoardPosition(
		// 	"rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - - -"
		// );
		// console.log(moveGenerator.moveGenerationTest(1), storage.moves);
	},
	view: () => {
		chessBoardModel.convertBoardPositionToFENString();
		return m("div.chess-board-container", chessBoardModel.drawBoard());
	},
};

export default chessBoard;
