import m from "mithril";
import chessBoard from "./chess-board/chess-board";
import menu from "./menu/menu";

export const App = {
	view: () => {
		return m("div#app-container", [m(chessBoard), m(menu)]);
	},
};

export default App;
