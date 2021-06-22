import Roact, { Binding, Children, Component, createBinding } from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";
import { Label } from "./Label";

interface Props {
	[key: string]: unknown;
	ZIndex: number;
	onEnter: Callback;
	onLeave: Callback;
	callback: Callback;
	BackgroundTranparency: number;
	Size: UDim2;
	Position: UDim2;
	TextSize: number;
	Text: string | Binding<string>;
	BorderSizePixel: number;
}

class Button extends Component<Partial<Props>> {
	static defaultProps = {
		ZIndex: 5,
		BackgroundTransparency: 1,
		Size: new UDim2(1, 0, 1, 0),
		TextSize: 24,
		Text: "Button",
		BorderSizePixel: 5,
	};
	private fillMotor: SingleMotor;
	private fillAlpha: Binding<number>;

	constructor(props: Partial<Props>) {
		super(props);
		this.fillMotor = new SingleMotor(0);
		const [fillAlpha, updateFA] = createBinding(this.fillMotor.getValue());
		this.fillAlpha = fillAlpha;
		this.fillMotor.onStep(updateFA);
	}
	render() {
		const cloned = { ...this.props };
		cloned.callback = undefined;
		cloned.onLeave = undefined;
		cloned.onEnter = undefined;
		cloned.BackgroundTransparency = 1;
		cloned.ZIndex! += 3;
		cloned[Children] = undefined;
		//Textbutton is a virtual container!
		return (
			<textbutton
				Event={{
					MouseEnter: () => {
						this.fillMotor.setGoal(new Spring(0.4, { frequency: 5 }));
						if (this.props.onEnter) {
							this.props.onEnter();
						}
					},
					MouseLeave: () => {
						this.fillMotor.setGoal(new Spring(0, { frequency: 5 }));
						if (this.props.onLeave) {
							this.props.onLeave();
						}
					},
					Activated: () => {
						if (this.props.callback) {
							this.props.callback();
						}
					},
					MouseButton1Down: () => {
						this.fillMotor.setGoal(new Spring(1, { frequency: 8 }));
					},
				}}
				{...cloned}
				TextTransparency={1}
			>
				{/* this is a border!!! */}
				<frame
					Size={UDim2.fromScale(1, 1)}
					BorderMode="Inset"
					BorderSizePixel={this.props.BorderSizePixel}
					BorderColor3={new Color3(0, 0, 0)}
					BackgroundColor3={new Color3(1, 1, 1)}
					ZIndex={this.props.ZIndex}
					Key="Border"
				>
					<frame
						Size={this.fillAlpha.map((value: number) => {
							return UDim2.fromScale(0, 1).Lerp(UDim2.fromScale(1, 1), value);
						})}
						BorderSizePixel={0}
						BackgroundColor3={new Color3()}
						Key="FillBlack"
						ZIndex={this.props.ZIndex! + 1}
					/>
					<Label
						Size={new UDim2(1, 0, 1, 0)}
						ZIndex={this.props.ZIndex! + 2}
						TextSize={this.props.TextSize}
						Text={this.props.Text}
						TextColor3={this.fillAlpha.map((value: number) => {
							return (value >= 0.5 && new Color3(1, 1, 1)) || new Color3(0, 0, 0);
						})}
					/>
				</frame>
			</textbutton>
		);
	}
}

export { Button };
