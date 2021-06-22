import Roact, { Component } from "@rbxts/roact";
import { BindsAll } from "shared/utils/UIs/RoactEssentials";

interface Props {
	[k: string]: unknown;
	Size: UDim2;
	Position: UDim2;
	ZIndex: number;
	BorderSizePixel: number;
	BackgroundColor3: Color3;
}

class Frame extends Component<Partial<BindsAll<Props>>> {
	static defaultProps = {
		Size: UDim2.fromScale(1, 1),
		Position: new UDim2(),
		ZIndex: 5,
		BorderSizePixel: 0,
		BackgroundColor3: Color3.fromRGB(35, 37, 39),
	};
	render() {
		const cloned = { ...this.props };
		return <frame {...cloned} />;
	}
}

export { Frame };
