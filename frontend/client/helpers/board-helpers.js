import boardSquareModel from "../board-square/board-square-model";
import storage from "../storage/storage";
import m from "mithril";

export const boardHelpers = {
	dragSquare: [],
	stickySquare: {},
	getCoordToLinearNum: (i, j) => {
		return 8 * i + j;
	},
	getLinearNumToCoord: (num) => {
		return [Math.floor(num / 8), num % 8];
	},
	checkTwoCoordsEqual: (coord_one, coord_two) => {
		return coord_one[0] === coord_two[0] && coord_one[1] === coord_two[1];
	},
	stringifyCoord: (coord) => {
		if (coord) {
			return `[${coord[0]},${coord[1]}]`;
		}
	},
	parseCoordString: (coord) => {
		const coordArr = coord.split("");
		return [Number(coordArr[1]), Number(coordArr[3])];
	},
	convertCoordToStandardNotation: (coord) => {
		return `${storage.alpha_col_mapping_reverse[coord[1]]}${
			storage.num_row_mapping_reverse[coord[0]]
		}`;
	},
	convertIDtoCoord: (id) => {
		const coord = id.split("-");
		return [Number(coord[0]), Number(coord[1])];
	},
	addDragAndDrop: () => {
		m.redraw();
		const imgPieces = document.querySelectorAll(".piece-image");
		imgPieces.forEach((piece) => {
			piece.addEventListener("dragstart", () => {
				const coord = boardHelpers.convertIDtoCoord(piece.id);
				boardSquareModel.handleSquareClick(coord[0], coord[1]);
				m.redraw();
			});
			piece.addEventListener("dragend", () => {
				boardSquareModel.handleSquareClick(
					boardHelpers.dragSquare[0],
					boardHelpers.dragSquare[1]
				);
				m.redraw();
			});
		});
		const boardSquares = document.querySelectorAll(".board-square");
		boardSquares.forEach((square) => {
			const coord = boardHelpers.convertIDtoCoord(square.id);
			square.addEventListener(
				"dragenter",
				() => (boardHelpers.dragSquare = [coord[0], coord[1]])
			);
		});
	},
};

export default boardHelpers;
