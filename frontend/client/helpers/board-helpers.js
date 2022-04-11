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
    convertMoveToAlgebraicNotation: (prevCoord, nextCoord) => {
        let notation = boardHelpers.convertCoordToStandardNotation(nextCoord);
		let pieceId = storage.board[prevCoord[0]][prevCoord[1]].pieceId;
		let isPawn = pieceId === "P" ? true : false;

		// Castling
		if(pieceId === "K" && prevCoord[1] === 4) {
			if(nextCoord[1] === prevCoord[1] + 2) return "O-O";
			else if(nextCoord[1] === prevCoord[1] - 2) return "O-O-O";
		}

		// Captures
		if(storage.board[nextCoord[0]][nextCoord[1]].pieceId || (isPawn && boardHelpers.checkTwoCoordsEqual(storage.en_passant_square, nextCoord))) {
			notation = "x" + notation;
			if(isPawn) notation = storage.alpha_col_mapping_reverse[prevCoord[1]] + notation;
		}

		// For all pieces beside pawns
		let includeCol = false, includeRow = false;
		if(!isPawn) {
			// Check if multiple pieces of the same type can move to the same final coordinate
			for (let i = 0; i < storage.moves.length; i++) {
				const startingCoord = boardHelpers.getLinearNumToCoord(i);
				if(pieceId !== storage.board[startingCoord[0]][startingCoord[1]].pieceId) continue;	// Only for same piece types
				const possibleMoves = storage.moves[i];
				for (let j = 0; j < possibleMoves.length; j++) {
					if (boardHelpers.checkTwoCoordsEqual(possibleMoves[j], nextCoord)) {
						if(startingCoord[1] !== prevCoord[1]) includeCol = true;
						else if(startingCoord[0] !== prevCoord[0]) includeRow = true;
					}
				}
			}
			if(includeRow) notation = storage.num_row_mapping_reverse[prevCoord[0]] + notation;
			if(includeCol) notation = storage.alpha_col_mapping_reverse[prevCoord[1]] + notation;

			notation = pieceId + notation;
		}

		// Promotions
        if(nextCoord[2]) {
            notation += "=" + nextCoord[2];
        }
        return notation;
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
