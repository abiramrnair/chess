import boardSquareModel from "../board-square/board-square-model";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import m from "mithril";

export const bot = {
	// Piece square values for move biasing
	PIECE_SQUARE_VALUES: {
		K: [
			-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
			-30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
			-40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
			-20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
		],
		Q: [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0,
			0, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		],
		B: [
			-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10,
			0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10,
			10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10,
			-20, -10, -10, -10, -10, -10, -10, -20,
		],
		N: [
			-5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 10, 10, 0, 0, -5, -5, 5, 10, 10, 10,
			10, 5, -5, -5, 5, 20, 25, 25, 20, 5, -5, -5, 5, 20, 25, 25, 20, 5, -5, -5,
			5, 10, 5, 5, 10, 5, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
			-5,
		],
		R: [
			0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0,
			0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0,
			0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
		],
		P: [
			90, 90, 90, 90, 90, 90, 90, 90, 30, 30, 40, 50, 50, 40, 30, 30, 20, 20,
			30, 40, 40, 30, 20, 20, 10, 10, 10, 35, 35, 10, 10, 10, 5, 5, 10, 35, 35,
			5, 5, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, -10, -15, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0,
		],
	},

	MIRROR_SQUARES: [
		56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42,
		43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29,
		30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1,
		2, 3, 4, 5, 6, 7,
	],
	P: 100,
	N: 300,
	B: 300,
	R: 500,
	Q: 900,
	K: 0,
	evaluatePosition: () => {
		const whiteEvaluation = bot.getMaterialCount("w");
		const blackEvaluation = bot.getMaterialCount("b");
		const diff = whiteEvaluation - blackEvaluation;
		const bias = storage.player_turn === "w" ? 1 : -1;
		return diff * bias;
	},
	getMoveScore: (moves) => {
		let moveScore = 0;
		const startingSquare = moves[0];
		const capturingSquare = moves[1];

		if (storage.board[capturingSquare[0]][capturingSquare[1]].pieceId) {
			moveScore +=
				10 *
					bot[storage.board[capturingSquare[0]][capturingSquare[1]].pieceId] -
				bot[storage.board[startingSquare[0]][startingSquare[1]].pieceId];
		}

		if (capturingSquare[2]) {
			moveScore += bot[capturingSquare[2]];
		}

		return moveScore;
	},
	getMaterialCount: (side) => {
		let material = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (
					storage.board[i][j].pieceId &&
					storage.board[i][j].pieceSide === side
				) {
					let pieceSquareWeight =
						side === "W"
							? bot["PIECE_SQUARE_VALUES"][storage.board[i][j].pieceId][
									i * 8 + j
							  ]
							: bot["PIECE_SQUARE_VALUES"][storage.board[i][j].pieceId][
									bot["MIRROR_SQUARES"][i * 8 + j]
							  ];
					material += bot[storage.board[i][j].pieceId] + pieceSquareWeight;
				}
			}
		}
		return material;
	},
	searchMove: (depth, maxDepth, alpha, beta) => {
		if (depth === 0) {
			return storage.bot_depth > 2
				? bot.searchAllCaptures(alpha, beta)
				: bot.evaluatePosition();
		}
		const moveSet = moveGenerator.getMoves();
		if (moveSet.length === 0) {
			if (storage.check_mate) {
				return Number.NEGATIVE_INFINITY;
			}
			return 0;
		}
		let bestEvaluationScore = Number.NEGATIVE_INFINITY;
		for (let i = 0; i < moveSet.length; i++) {
			const startingCoord = moveSet[i][0];
			const move = moveSet[i][1];
			boardSquareModel.movePiece(startingCoord, move);
			const currentEvaluation =
				-1 * bot.searchMove(depth - 1, maxDepth, -1 * beta, -1 * alpha);
			if (currentEvaluation > bestEvaluationScore) {
				bestEvaluationScore = currentEvaluation;
				if (depth === maxDepth) {
					storage.bot_next_move = [startingCoord, move];
				}
			}
			boardSquareModel.undoMovePiece();
			if (currentEvaluation >= beta) {
				return beta;
			}
			if (currentEvaluation > alpha) {
				alpha = currentEvaluation;
			}
		}
		return alpha;
	},
	searchAllCaptures: (alpha, beta) => {
		let evaluation = bot.evaluatePosition();
		if (evaluation >= beta) {
			return beta;
		}
		if (evaluation > alpha) {
			alpha = evaluation;
		}
		const moveSet = moveGenerator.getMoves(true);

		for (let i = 0; i < moveSet.length; i++) {
			const startingCoord = moveSet[i][0];
			const move = moveSet[i][1];
			boardSquareModel.movePiece(startingCoord, move);
			evaluation = -1 * bot.searchAllCaptures(-1 * beta, -1 * alpha);
			boardSquareModel.undoMovePiece();

			if (evaluation >= beta) {
				return beta;
			}
			if (evaluation > alpha) {
				alpha = evaluation;
			}
		}

		return alpha;
	},
	makeBotMove: (depth) => {
		storage.bot_calculating = true;
		const maxDepth = depth;
		bot.searchMove(
			depth,
			maxDepth,
			Number.NEGATIVE_INFINITY,
			Number.POSITIVE_INFINITY
		);
		boardSquareModel.movePiece(
			storage.bot_next_move[0],
			storage.bot_next_move[1]
		);
		moveGenerator.getMoves();
		storage.bot_calculating = false;
		m.redraw();
	},
};

export default bot;
