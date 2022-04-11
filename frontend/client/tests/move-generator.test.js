import moveGenerator from "../logic/move-generator";
import chessBoardModel from "../chess-board/chess-board-model";
import storage from "../storage/storage";
import testHelpers from "../helpers/test-helpers";

describe("moveGenerationTest", () => {
	describe("Initial Position Test", () => {
		beforeEach(() => {
			storage.board = [];
			chessBoardModel.initBoardLayout();
		});
		it("should generate 4865609 nodes for depth 5 from start of game position", () => {
			const moves = moveGenerator.moveGenerationTest(5);
			expect(moves).toEqual(testHelpers.START_OF_GAME_DEPTH_FIVE_MOVES); // 197281 nodes
		});
	});
	describe("moveGenerationTestPerftPosition2", () => {
		beforeEach(() => {
			storage.board = [];
			chessBoardModel.initBoardLayout();
			storage.test_moves = [];
			chessBoardModel.convertFENStringToBoardPosition(
				"r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - "
			);
		});
		it("should generate 4085603 nodes for depth 4 from perft position 2", () => {
			const moves = moveGenerator.moveGenerationTest(4);
			expect(moves).toEqual(testHelpers.PERFT_POS_2_DEPTH_FOUR_MOVES); // 97862 nodes
		});
	});
	describe("moveGenerationTestPerftPosition5", () => {
		beforeEach(() => {
			storage.board = [];
			chessBoardModel.initBoardLayout();
			chessBoardModel.convertFENStringToBoardPosition(
				"rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"
			);
		});
		it("should generate 2103487 nodes for depth 4 from perft position 5", () => {
			const moves = moveGenerator.moveGenerationTest(4);
			expect(moves).toEqual(testHelpers.PERFT_POS_5_DEPTH_FOUR_MOVES); // 2103487 nodes
		});
	});
	describe("moveGenerationTestPerftPosition6", () => {
		beforeEach(() => {
			storage.board = [];
			chessBoardModel.initBoardLayout();
			chessBoardModel.convertFENStringToBoardPosition(
				"r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - - - -"
			);
		});
		it("should generate 89890 nodes for depth 3 from perft position 6", () => {
			const moves = moveGenerator.moveGenerationTest(3);
			expect(moves).toEqual(testHelpers.PERFT_POS_6_DEPTH_THREE_MOVES); // 89890 nodes
		});
	});
});
