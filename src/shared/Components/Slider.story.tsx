import Roact, { mount, Tree, unmount, update } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { Slider } from "./Slider";

export = (target: UIBase) => {
	const tree: Tree = mount(<Slider Size={new UDim2(0, 400, 0, 50)} unit={1} />, target);
	return () => {
		unmount(tree);
	};
};
