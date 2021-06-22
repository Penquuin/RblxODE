import Roact, { Binding, Component } from "@rbxts/roact";

interface Props {
	[Key: string]: unknown;
	Font: Enum.Font;
	TextSize: number;
	Size: UDim2;
	Position: UDim2;
	BorderSizePixel: number;
	TextColor3: Color3 | Binding<Color3>;
	Text: string | Binding<string>;
	BackgroundColor3: Color3;
	BackgroundTransparency: number;
}

class Label extends Component<Partial<Props>> {
	static defaultProps = {
		Font: Enum.Font.Gotham,
		TextSize: 22,
		Size: UDim2.fromScale(1, 1),
		Position: new UDim2(),
		BorderSizePixel: 0,
		TextColor3: new Color3(1, 1, 1),
		BackgroundColor3: Color3.fromRGB(35, 37, 39),
		Text: "Label",
		BackgroundTransparency: 1,
	};
	render() {
		return <textlabel {...this.props} />;
	}
}

export { Label };
