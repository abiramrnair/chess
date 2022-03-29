import chessBoardModel from "../chess-board/chess-board-model";
import storage from "../storage/storage";
import testHelpers from "../helpers/test-helpers";

describe("chessBoardModel", () => {
	beforeEach(() => {
		storage.board = [];
	});

	it("should initialize board to correct starting position", () => {
		chessBoardModel.initBoardLayout();
		const board = chessBoardModel.getEZBoardRepresentation();
		expect(board).toEqual(testHelpers.initialBoardLayoutArray);
	});

	it("should take FEN string example one and convert to proper board position", () => {
		chessBoardModel.initBoardLayout();
		chessBoardModel.convertFENStringToBoardPosition(
			"rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - - - -"
		);
		const board = chessBoardModel.getEZBoardRepresentation();
		expect(board).toEqual(testHelpers.fenStringExampleOne);
	});

	it("should take FEN string example two and convert to proper board position", () => {
		chessBoardModel.initBoardLayout();
		chessBoardModel.convertFENStringToBoardPosition(
			"r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1 w - - - - -"
		);
		const board = chessBoardModel.getEZBoardRepresentation();
		expect(board).toEqual(testHelpers.fenStringExampleTwo);
	});
});
