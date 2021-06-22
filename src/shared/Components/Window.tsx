import { Instant, SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Children, Component, createBinding } from "@rbxts/roact";
import { Lighting } from "@rbxts/services";
import { Frame } from "./Frame";
import { Label } from "./Label";

interface WindowProps {
	[key: string]: unknown;
	Enabled: boolean;
	Title: string;
}

interface WindowState {
	Alive: boolean;
}

//Cursed lol
type pp = Partial<WindowProps>;

class Window extends Component<pp, WindowState> {
	private movMotor: SingleMotor;
	private movBind: Binding<number>;
	private bf: BlurEffect;
	private mounted = false;
	private originalSize: number;
	static defaultProps: WindowProps = {
		Enabled: false,
		Title: "A Window",
	};
	public state: WindowState = {
		Alive: false,
	};
	constructor(props: pp) {
		super(props);
		this.movMotor = new SingleMotor(0);
		this.bf = Lighting.FindFirstChild("Blur")! as BlurEffect;
		this.originalSize = this.bf.Size;
		const [mb, umb] = createBinding(this.movMotor.getValue());
		this.movBind = mb;
		this.movMotor.onStep((val: number) => {
			if (this.mounted) {
				this.bf.Size = 24 * val;
			}
			umb(val);
		});
		this.movMotor.onComplete(() => {
			if (this.movMotor.getValue() <= 0) {
				const copied = { ...this.state };
				copied.Alive = false;
				this.setState(copied);
			}
		});
	}
	willUnmount() {
		this.mounted = false;
		this.bf.Size = this.originalSize;
	}
	didMount() {
		this.mounted = true;
		if (this.props.Enabled) {
			const copied = { ...this.state };
			copied.Alive = true;
			this.setState(copied);
			this.movMotor.setGoal(new Spring(1, { frequency: 5, dampingRatio: 1 }));
		} else {
			this.movMotor.setGoal(new Instant(0));
		}
	}
	didUpdate(prevProps: pp, _: WindowState) {
		if (prevProps.Enabled !== this.props.Enabled) {
			if (this.props.Enabled) {
				const copied = { ...this.state };
				copied.Alive = true;
				this.setState(copied);
				this.movMotor.setGoal(new Spring(1, { frequency: 5, dampingRatio: 1 }));
			} else {
				this.movMotor.setGoal(new Instant(0));
			}
		}
	}
	render() {
		if (!this.state.Alive) {
			return undefined;
		}
		return (
			<screengui ResetOnSpawn={false} IgnoreGuiInset={false}>
				<Frame
					Size={UDim2.fromOffset(400, 500)}
					Position={this.movBind.map((a) => {
						return new UDim2(0.5, 0, 0.5, -10).Lerp(new UDim2(0.5, 0, 0.5, 0), a);
					})}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Label
						Key="title"
						Size={new UDim2(0.8, 0, 0, 30)}
						Position={new UDim2(0, 0, 0, -5)}
						AnchorPoint={new Vector2(0, 1)}
						Text={this.props.Title}
						BackgroundTransparency={0}
					/>
					<frame
						Key="cccontainer"
						Size={new UDim2(1, -20, 1, -20)}
						ZIndex={6}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(0.1, 0.1, 0.1)}
					>
						{this.props[Children]}
					</frame>
				</Frame>
			</screengui>
		);
	}
}

export { Window };
