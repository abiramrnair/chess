import m from "mithril";
import backArrow from "../assets/back-arrow.png";
import newGameIcon from "../assets/refresh-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import boardSquareModel from "../board-square/board-square-model";
import chessBoardModel from "../chess-board/chess-board-model";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";

export const menu = {
	view: () => {
		return m(
			"div.menu-container",
			m(
				"button.action-button",
				{
					onclick: () => {
						boardSquareModel.undoMovePiece();
						moveGenerator.getMoves();
						storage.selected_square_coord = null;
						m.redraw();
					},
					disabled: !storage.move_log.length,
				},
				m("img", { src: backArrow })
			),
			m(
				"button.action-button",
				{
					onclick: () => {
						storage.menu_open = storage.menu_open ? false : true;
					},
				},
				m("img", { src: settingsIcon })
			),
			m(
				"button.action-button",
				{
					onclick: () => {
						chessBoardModel.initBoardLayout();
					},
				},
				m("img", { src: newGameIcon })
			)
		);
	},
};

export default menu;
