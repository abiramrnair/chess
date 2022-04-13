import m from "mithril";
import chessBoardModel from "../chess-board/chess-board-model";
import moveGenerator from "../logic/move-generator";
import storage from "../storage/storage";
import toggleSwitch from "../toggle-switch/toggle-switch";

export const menuOptions = {
	view: () => {
		const themeOptions = m(
			"select#theme-options.theme-options",
			{
				value: storage.board_theme,
				onchange: () =>
					(storage.board_theme =
						document.getElementById("theme-options").value),
			},
			[
				m("option", { value: "default" }, "Oak"),
				m("option", { value: "blue" }, "Icy"),
				m("option", { value: "green" }, "Vine"),
			]
		);
		const botOptions = m(
			"select#bot-options.bot-options",
			{
				value:
					storage.bot_players["b"] && !storage.bot_players["w"]
						? "b"
						: storage.bot_players["w"] && !storage.bot_players["b"]
						? "w"
						: "d",
				onchange: () => {
					if (document.getElementById("bot-options").value === "d") {
						storage.bot_players["w"] = false;
						storage.bot_players["b"] = false;
						storage.board_perspective = "w";
						return;
					} else if (document.getElementById("bot-options").value === "t") {
						storage.bot_players["w"] = true;
						storage.bot_players["b"] = true;
						storage.board_perspective = "w";
						return;
					}
					storage.bot_players[
						document.getElementById("bot-options").value
					] = true;
					storage.bot_players[
						storage.opposite_player[
							document.getElementById("bot-options").value
						]
					] = false;
					if (storage.bot_players["w"]) {
						storage.board_perspective = "b";
					} else {
						storage.board_perspective = "w";
					}
				},
			},
			[
				m("option", { value: "d" }, "Disabled"),
				m("option", { value: "b" }, "Black"),
				m("option", { value: "w" }, "White"),
				m("option", { value: "t" }, "Bot v.s Bot"),
			]
		);
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
				},
			})
		);
		const perspectiveOptions = m(
			"select#perspective-options.perspective-options",
			{
				value: storage.board_perspective,
				onchange: () =>
					(storage.board_perspective = document.getElementById(
						"perspective-options"
					).value),
			},
			[
				m("option", { value: "w" }, "White"),
				m("option", { value: "b" }, "Black"),
			]
		);

		return m("div.menu-options-container", [
			m("div", "Settings"),
			m("div.options", [
				m("div.option", "Theme", themeOptions),
				m("div.option", "Bot Opponent", botOptions),
				m("div.option", `Bot Depth (${storage.bot_depth})`, depthOptions),
				m(
					"div.option",
					"Highlight Last Move",
					m(toggleSwitch, {
						onChangeFunc: () =>
							(storage.show_last_move = !storage.show_last_move),
						isChecked: storage.show_last_move,
					})
				),
				m("div.option", "Board Perspective", perspectiveOptions),
			]),
			m(
				"button.action-button.menu-exit-button",
				{ onclick: () => (storage.menu_open = false) },
				"Exit"
			),
		]);
	},
};

export default menuOptions;
