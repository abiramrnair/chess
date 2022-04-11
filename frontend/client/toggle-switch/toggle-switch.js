import m from "mithril";

export const toggleSwitch = {
	view: (vnode) => {
		const { isChecked, onChangeFunc } = vnode.attrs;
		return m("label.switch", [
			m("input", {
				type: "checkbox",
				onchange: onChangeFunc,
				checked: isChecked,
			}),
			m("span.toggle-slider round"),
		]);
	},
};

export default toggleSwitch;
