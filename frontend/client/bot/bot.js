import boardSquareModel from "../board-square/board-square-model";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import m from "mithril";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const bot = {
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
	getMaterialCount: (side) => {
		let materialCount = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (
					storage.board[i][j].pieceId &&
					storage.board[i][j].pieceSide === side
				) {
					materialCount += bot[storage.board[i][j].pieceId];
				}
			}
		}
		return materialCount;
	},
	searchMove: (depth, maxDepth, alpha, beta) => {
		if (depth === 0) {
			return bot.evaluatePosition();
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
	makeBotMove: async (depth) => {
		await sleep(10);
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
		storage.bot_calculating = false;
		moveGenerator.getMoves();
		m.redraw();
	},
};

export default bot;
