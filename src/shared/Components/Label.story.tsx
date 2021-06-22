import Roact from "@rbxts/roact";
import { Label } from "./Label";

export = (target: UIBase) => {
	const tree = Roact.mount(<Label />, target);
	return () => {
		Roact.unmount(tree);
	};
};
