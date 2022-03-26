import chessBoardModel from "../chess-board/chess-board-model";
import moveGenerator from "../logic/move-generator";

describe("Move generator tests", () => {
	describe("Pawn move test with no enemies should return two squares for first move", () => {
		test("generateAllPawnMoves", () => {
			chessBoardModel.initBoardLayout();
			chessBoardModel.convertFENStringToBoardPosition(
				"8/8/8/8/8/8/3P4/8 w KQkq"
			);
			moveGenerator.generateAllPawnMoves(6, 3);
			expect(storage.moves[JSON.stringify([6, 3])]).toEqual({});
		});
	});
});
