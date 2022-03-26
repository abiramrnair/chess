import m from "mithril";
import storage from "../storage/storage";
import boardSquareModel from "./board-square-model";

export const boardSquare = {
	view: (vnode) => {
		const { squareInfo } = vnode.attrs;
		const squareId = squareInfo.coord;
		const inCheck = squareInfo.inCheck;
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
		return m(
			`div#${squareId[0]}-${squareId[1]}.board-square${
				imgLink ? ".clickable" : ""
			}${selectedSquare ? ".selected" : ""}`,
			{
				onclick: () => {
					boardSquareModel.handleSquareClick(squareId[0], squareId[1]);
					m.redraw();
				},
			},
			[
				imgLink &&
					m("img", {
						src: imgLink,
					}),
				m(
					`div.indicator${legalSquare ? ".legal-square" : ""}${
						inCheck ? ".in-check" : ""
					}`
				),
			]
		);
	},
};

export default boardSquare;
