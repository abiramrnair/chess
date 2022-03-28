import m from "mithril";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import chessBoardModel from "./chess-board-model";

export const chessBoard = {
	oninit: () => {
		storage.player_turn = "W";
		chessBoardModel.initBoardLayout();
		// chessBoardModel.convertFENStringToBoardPosition(
		// 	"r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - - -"
		// );
		// console.log(moveGenerator.moveGenerationTest(3));
		moveGenerator.getMoves();
	},
	view: () => {
		chessBoardModel.convertBoardPositionToFENString();
		return m("div.chess-board-container", chessBoardModel.drawBoard());
	},
};

export default chessBoard;
