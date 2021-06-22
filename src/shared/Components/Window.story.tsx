import Roact, { mount, Tree, unmount, update } from "@rbxts/roact";
import { StarterGui } from "@rbxts/services";
import { Window } from "./Window";

export = (target: UIBase) => {
	const tree: Tree = mount(<Window Enabled={true} />, StarterGui);
	return () => {
		unmount(tree);
	};
};
