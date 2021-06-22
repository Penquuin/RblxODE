import Roact, { Binding, Children, Component, createBinding, createRef, Element, Ref } from "@rbxts/roact";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { Label } from "./Label";

interface sliderProps {
	[Key: string]: unknown;
	Size: UDim2;
	Position: UDim2;
	ZIndex: number;
	AnchorPoint: Vector2;
	min: number;
	max: number;
	unit: number;
	BackgroundTransparency: number;
	Text: string;
	changed: (val: number) => void;
}

type pp = Partial<sliderProps>;

class Slider extends Component<pp> {
	static defaultProps = {
		Size: new UDim2(1, 0, 1, 0),
		Position: new UDim2(0, 0, 0, 0),
		ZIndex: 5,
		min: 0,
		max: 5,
		unit: 1,
		BackgroundTransparency: 0,
		Text: "Slider",
	};
	private pivotData = new Array<[value: number, pos: UDim2]>();
	private posBind: Binding<UDim2>;
	private updatePosBind: (newVal: UDim2) => void;
	private dragging: boolean;
	private mainFrameRef: Ref<TextButton>;
	private toWhere: UDim2;
	private changedVal: Binding<number>;
	private changeVal: (newVal: number) => void;
	private mounted = false;
	private signal?: RBXScriptConnection;

	constructor(pro: pp) {
		super(pro);
		[this.changedVal, this.changeVal] = createBinding(this.props.min!);
		this.mainFrameRef = createRef();
		this.dragging = true;
		const [pb, upb] = createBinding(new UDim2(0, 0, 0.5, 0));
		this.posBind = pb;
		this.updatePosBind = upb;
		this.toWhere = pb.getValue();
	}
	willUnmount() {
		this.mounted = false;
	}
	didMount() {
		this.mounted = true;
		if (this.props.changed) {
			this.props.changed(this.props.min!);
		}
		spawn(() => {
			while (this.mounted) {
				this.updatePosBind(this.posBind.getValue().Lerp(this.toWhere!, 0.4));
				RunService.RenderStepped.Wait();
			}
		});
	}
	public startDrag(): void {
		this.signal?.Disconnect();
		this.signal = UserInputService.InputEnded.Connect((i, g) => {
			if (i.UserInputType === Enum.UserInputType.MouseButton1 || i.UserInputType === Enum.UserInputType.Touch) {
				this.dragging = false;
				this.signal?.Disconnect();
			}
		});
		this.dragging = true;
		const mouse: Mouse = Players.LocalPlayer.GetMouse();
		const fr = this.mainFrameRef.getValue();
		if (!fr) {
			return;
		}
		const absPos = fr.AbsolutePosition;
		const absSize = fr.AbsoluteSize;
		const right = absPos.X;
		const left = right + absSize.X;
		while (this.dragging) {
			RunService.RenderStepped.Wait();
			const to = new UDim2(
				new UDim((math.clamp(mouse.X, right, left) - absPos.X) / absSize.X, 0),
				new UDim(0.5, 0),
			);
			let nearestDist = math.huge;
			let nearestPos: UDim2;
			let nearestValue = 0;
			for (const the of this.pivotData) {
				const len = math.abs(to.X.Scale - the[1].X.Scale);
				if (len <= nearestDist) {
					nearestDist = len;
					nearestValue = the[0];
					nearestPos = the[1];
				}
			}
			this.toWhere = nearestPos!;
			if (this.props.changed) {
				if (this.changedVal.getValue() !== nearestValue!) {
					this.props.changed(nearestValue!);
					this.changeVal(nearestValue);
				}
			}
		}
	}
	render() {
		const cloned = { ...this.props };
		cloned.BackgroundTransparency = 1;
		cloned.TextTransparency = 1;
		cloned.min = undefined;
		cloned.max = undefined;
		cloned.unit = undefined;
		cloned.changed = undefined;
		cloned[Children] = undefined;
		cloned.ZIndex = this.props.ZIndex! + 5;
		const totalPivots = (this.props.max! - this.props.min!) / this.props.unit! + 1;
		const pivots: Array<Element> = new Array<Element>();
		this.pivotData.clear();
		for (let index = 0; index < totalPivots; index++) {
			const pos = new UDim2(index / (totalPivots - 1), 0, 0.5, 0);
			this.pivotData.push([index * this.props.unit! + this.props.min!, pos]);
			pivots.push(
				<frame
					Key={"pivot" + index}
					BorderSizePixel={0}
					BackgroundColor3={new Color3(1, 1, 1)}
					Size={new UDim2(0, 2, 0, 5)}
					Position={pos}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={this.props.BackgroundTransparency}
					ZIndex={this.props.ZIndex! + 2}
				/>,
			);
		}
		return (
			<textbutton
				{...cloned}
				Event={{
					MouseButton1Down: () => {
						this.startDrag();
					},
				}}
				Ref={this.mainFrameRef}
			>
				<frame
					Key="Line"
					Size={new UDim2(1, 0, 0, 2)}
					BackgroundColor3={new Color3(1, 1, 1)}
					Position={UDim2.fromScale(0, 0.5)}
					BorderSizePixel={0}
					BackgroundTransparency={this.props.BackgroundTransparency}
					ZIndex={this.props.ZIndex! + 1}
				></frame>
				<Label
					Key="Title"
					Text={this.props.Text}
					Size={new UDim2(0.5, 0, 0.3, 0)}
					Position={new UDim2(0, 0, 0, 2)}
					TextSize={22}
					ZIndex={this.props.ZIndex! + 1}
				/>
				<frame
					Key="Bun"
					Size={new UDim2(0, 15, 0, 15)}
					Position={this.posBind}
					BackgroundColor3={new Color3(1, 0.8, 0.8)}
					BorderSizePixel={0}
					BackgroundTransparency={0.2}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={this.props.ZIndex! + 3}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
				</frame>
				<textlabel
					Key="Value"
					Size={new UDim2(0, 15, 0.4, 0)}
					Position={this.posBind.map((value: UDim2) => {
						return new UDim2(value.X, new UDim(1, 0));
					})}
					AnchorPoint={new Vector2(0, 1)}
					Text={this.changedVal.map((v: number) => {
						return tostring(v);
					})}
					BackgroundTransparency={1}
					Font={Enum.Font.GothamBlack}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={16}
					ZIndex={this.props.ZIndex! + 1}
				/>
				{pivots}
			</textbutton>
		);
	}
}

export { Slider };
