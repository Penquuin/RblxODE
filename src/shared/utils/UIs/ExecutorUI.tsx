import Roact, { Binding, Component, Element, joinBindings } from "@rbxts/roact";
import { Button } from "shared/Components/Button";
import { Frame } from "shared/Components/Frame";
import { Label } from "shared/Components/Label";
import { Slider } from "shared/Components/Slider";
import { Window } from "shared/Components/Window";

interface ExeProps {
	onStop: () => void;
	onStart: () => void;
	changed: (
		type: "Gravity" | "AirResistance" | "InitialVelocity" | "InitialAngle" | "TotalTime",
		value: number,
	) => void;
	time: Binding<number>;
	totalTime: Binding<number>;
	velocity: Binding<number>;
}

interface ExeStates {
	Enabled: boolean;
	Running: boolean;
}

class ExecutorUI extends Component<ExeProps, ExeStates> {
	public state = {
		Enabled: false,
		Running: false,
	};
	constructor(props: ExeProps) {
		super(props);
	}
	didUpdate(_: ExeProps, prevState: ExeStates) {
		print(prevState.Running, this.state.Running);
	}
	render(): Element {
		return (
			<Roact.Fragment>
				{/* Buttons */}
				<screengui ResetOnSpawn={false} IgnoreGuiInset={false}>
					<Frame
						Size={new UDim2(0.25, 0, 0, 150)}
						Position={new UDim2(1, -10, 0, 10)}
						AnchorPoint={new Vector2(1, 0)}
					>
						<Label Text="Terminal" Size={new UDim2(1, 0, 0.3, 0)} ZIndex={10} />
						<frame
							Key="Progress"
							Size={joinBindings([this.props.time, this.props.totalTime]).map((values: Array<number>) => {
								return new UDim2(0.9 * (values[0] / values[1]), 0, 0, 6);
							})}
							BorderSizePixel={0}
							Position={new UDim2(0.05, 0, 1, -2)}
							AnchorPoint={new Vector2(0, 1)}
							ZIndex={8}
							BackgroundColor3={new Color3(1, 0.7, 0.7)}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</frame>
						<Button
							Size={new UDim2(0.9, 0, 0.4, 0)}
							Text="Panel"
							TextSize={24}
							Position={new UDim2(0.5, 0, 0.3, 18)}
							AnchorPoint={new Vector2(0.5, 0)}
							callback={() => {
								const copied = { ...this.state };
								copied.Enabled = !copied.Enabled;
								this.setState(copied);
							}}
						/>
					</Frame>
				</screengui>
				{/* Window*/}
				<Window Enabled={this.state.Enabled} Title="Control Panel">
					<Button
						Text={(this.state.Running && "Stop") || "Start"}
						Size={(this.state.Running && UDim2.fromScale(0.8, 0.8)) || UDim2.fromScale(0.8, 0.2)}
						Position={(this.state.Running && UDim2.fromScale(0.5, 0.5)) || new UDim2(0.5, 0, 0, 10)}
						AnchorPoint={(this.state.Running && new Vector2(0.5, 0.5)) || new Vector2(0.5, 0)}
						callback={() => {
							const c = { ...this.state };
							c.Running = !c.Running;
							this.setState(c);
							if (c.Running) {
								this.props.onStart();
							} else {
								this.props.onStop();
							}
						}}
						ZIndex={20}
					/>
					{(!this.state.Running && (
						<frame
							Size={new UDim2(0.9, 0, 0.7, 0)}
							Position={new UDim2(0.5, 0, 0.25, 0)}
							BackgroundTransparency={1}
							AnchorPoint={new Vector2(0.5, 0)}
						>
							<uilistlayout Padding={new UDim(0, 10)} FillDirection="Vertical" />
							<Slider
								Size={new UDim2(0.9, 0, 0, 50)}
								Position={new UDim2(0.05, 0, 0, 10)}
								min={-175}
								max={175}
								unit={10}
								Text="Angle"
								changed={(val: number) => {
									this.props.changed("InitialAngle", val);
								}}
							/>
							<Slider
								Size={new UDim2(0.9, 0, 0, 50)}
								Position={new UDim2(0.05, 0, 0, 70)}
								min={0}
								max={60}
								unit={4}
								Text="Gravity"
								changed={(val: number) => {
									this.props.changed("Gravity", val);
								}}
							/>
							<Slider
								Size={new UDim2(0.9, 0, 0, 50)}
								Position={new UDim2(0.05, 0, 0, 70)}
								min={0}
								max={250}
								unit={5}
								Text="Inital Velocity"
								changed={(val: number) => {
									this.props.changed("InitialVelocity", val);
								}}
							/>
							<Slider
								Size={new UDim2(0.9, 0, 0, 50)}
								Position={new UDim2(0.05, 0, 0, 70)}
								min={0}
								max={5}
								unit={0.05}
								Text="Air Resistance"
								changed={(val: number) => {
									this.props.changed("AirResistance", val);
								}}
							/>
							<Slider
								Size={new UDim2(0.9, 0, 0, 50)}
								Position={new UDim2(0.05, 0, 0, 70)}
								min={50}
								max={2000}
								unit={50}
								Text="Total Time"
								changed={(val: number) => {
									this.props.changed("TotalTime", val);
								}}
							/>
						</frame>
					)) ||
						undefined}
				</Window>
			</Roact.Fragment>
		);
	}
}

export { ExecutorUI };
