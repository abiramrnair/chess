import storage from "../storage/storage";

export const boardHelpers = {
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
};

export default boardHelpers;
