import chessBoardModel from "../chess-board/chess-board-model";
import testHelpers from "../helpers/test-helpers";
import storage from "../storage/storage";
/**
 * @jest-environment jsdom
 */

describe("Chess board model tests", () => {
	describe("initBoardLayout", () => {
		test("should initialize the board in correct starting game state", () => {
			chessBoardModel.initBoardLayout();
			expect(chessBoardModel.getEZBoardRepresentation()).toEqual(
				testHelpers.initialBoardLayoutArray
			);
		});
	});
	describe("convertFENStringToBoardPosition", () => {
		beforeEach(() => {
			storage.board = [];
			chessBoardModel.initBoardLayout();
		});
		test("should populate the board according to the FEN string", () => {
			expect(
				chessBoardModel.convertFENStringToBoardPosition(
					"rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR"
				)
			).toEqual(testHelpers.fenStringExampleOne);
			expect(
				chessBoardModel.convertFENStringToBoardPosition(
					"r1b1k2r/pp2bp1p/2np1n2/q1p1p1p1/1P1PPP2/N1P1B2N/P5PP/R2QKB1R"
				)
			).toEqual(testHelpers.fenStringExampleTwo);
		});
	});
});
