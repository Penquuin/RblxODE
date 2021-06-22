import Roact, { mount, Tree, unmount } from "@rbxts/roact";
import { Button } from "./Button";

export = (target: UIBase) => {
	const tree: Tree = mount(
		<Button
			Size={new UDim2(0, 200, 0, 50)}
			Position={new UDim2(0, 20, 0, 20)}
			callback={() => {
				print("Yo!");
			}}
		/>,
		target,
	);
	return () => {
		unmount(tree);
	};
};
