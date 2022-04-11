import m from "mithril";
import chessBoardModel from "../chess-board/chess-board-model";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";

export const menuOptions = {
	view: () => {
		const themeOptions = m(
			"select#theme-options.theme-options",
			{
				value: storage.board_theme,
				onchange: (e) =>
					(storage.board_theme =
						document.getElementById("theme-options").value),
			},
			[
				m("option", { value: "default" }, "Oak"),
				m("option", { value: "blue" }, "Icy"),
				m("option", { value: "green" }, "Vine"),
			]
		);
		const botOptions = m("select.bot-options", [
			m("option", { value: "Black" }, "Black"),
			m("option", { value: "White" }, "White"),
			m("option", { value: "Disabled" }, "Disabled"),
		]);
		const depthOptions = m(
			"div.depth-slider",
			m("input#depth-slider.slider", {
				type: "range",
				min: "1",
				max: "5",
				value: String(storage.bot_depth),
				oninput: () => {
					storage.bot_depth = Number(
						document.getElementById("depth-slider").value
					);
					chessBoardModel.initBoardLayout();
					moveGenerator.getMoves();
				},
			})
		);

		return m("div.menu-options-container", [
			m("div", "Settings"),
			m("div.options", [
				m("div.option", "Theme", themeOptions),
				m("div.option", "Bot Opponent", botOptions),
				m("div.option", `Bot Depth (${storage.bot_depth})`, depthOptions),
			]),
		]);
	},
};

export default menuOptions;
