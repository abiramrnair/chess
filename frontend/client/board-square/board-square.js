import m from "mithril";
import boardHelpers from "../helpers/board-helpers";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import boardSquareModel from "./board-square-model";

export const boardSquare = {
	view: (vnode) => {
		const { squareInfo } = vnode.attrs;
		const squareId = squareInfo.coord;
		const inCheck =
			!storage.bot_calculating &&
			storage.in_check &&
			squareInfo.pieceId === "K" &&
			squareInfo.pieceSide === storage.player_turn;
		const selectedSquare =
			JSON.stringify([squareId[0], squareId[1]]) ===
			JSON.stringify(storage.selected_square_coord);
		const imgLink = boardSquareModel.getSquarePieceImage(
			squareId[0],
			squareId[1]
		);
		const legalSquare = storage.legal_squares.includes(
			JSON.stringify([squareId[0], squareId[1]])
		);
		const isPromotionOptions =
			JSON.stringify(squareInfo.coord) ===
			JSON.stringify(storage.promotion_coord);
		const boardTheme = storage.board_theme;
		const pastMoveStarting =
			storage.show_last_move &&
			storage.move_log[storage.move_log.length - 1] &&
			boardHelpers.checkTwoCoordsEqual(
				squareInfo.coord,
				storage.move_log[storage.move_log.length - 1][0].coord
			);
		const pastMoveEnding =
			storage.show_last_move &&
			storage.move_log[storage.move_log.length - 1] &&
			boardHelpers.checkTwoCoordsEqual(
				squareInfo.coord,
				storage.move_log[storage.move_log.length - 1][1].coord
			);
		return m(
			`div#${squareId[0]}-${squareId[1]}.board-square${
				boardTheme ? `.${boardTheme}` : ""
			}${imgLink ? ".clickable" : ""}${selectedSquare ? ".selected" : ""}${
				pastMoveStarting ? ".past-move-starting" : ""
			}${pastMoveEnding ? ".past-move-ending" : ""}`,
			{
				onclick: () => {
					if (!storage.bot_calculating) {
						boardSquareModel.handleSquareClick(squareId[0], squareId[1]);
						m.redraw();
					}
				},
			},

			!isPromotionOptions
				? [
						imgLink &&
							m(
								`img#${squareId[0]}-${squareId[1]}${
									storage.board_perspective === "b" ? ".rotated" : ""
								}.piece-image`,
								{
									src: imgLink,
									draggable: true,
								}
							),
						m(
							`div.indicator${legalSquare ? ".legal-square" : ""}${
								inCheck ? ".in-check" : ""
							}`
						),
				  ]
				: boardSquare.generatePromotionOptions(squareId[0], squareId[1])
		);
	},
	generatePromotionOptions: (i, j) => {
		const coord = storage.selected_square_coord;
		return m("div.promotion-square-options", [
			storage.promotion_pieces.map((piece) => {
				return m("img", {
					src: boardSquareModel.getPromotionPieceImage(
						coord[0],
						coord[1],
						piece
					),
					onclick: () => {
						boardSquareModel.movePiece(coord, [i, j, piece]);
						storage.promotion_coord = null;
						storage.legal_squares = [];
						storage.selected_square_coord = null;
						moveGenerator.getMoves();
					},
				});
			}),
		]);
	},
};

export default boardSquare;
