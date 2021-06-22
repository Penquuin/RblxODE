import Roact from "@rbxts/roact";
import { Frame } from "./Frame";

export = (target: UIBase) => {
	const tree = Roact.mount(
		<Frame>
			<frame Size={UDim2.fromOffset(50, 50)} Position={UDim2.fromOffset(10, 10)} />
		</Frame>,
		target,
	);
	return () => {
		Roact.unmount(tree);
	};
};
