import Roact, { Binding, createBinding, Tree } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { Frame } from "shared/Components/Frame";
import { Label } from "shared/Components/Label";
import { MathSolver } from "./MathSolver";
import { PivotPart } from "./PivotPart";
import { ExecutorUI } from "./UIs/executorUI";

class Executor {
	private model: Model;
	private solverSigleton: MathSolver;
	private pivotPart: PivotPart;
	private velDisplay: PivotPart;
	private UIHandler: Tree;
	private updateT: Callback;
	private totalTime: Binding<number>;
	private updateTotalTime: (val: number) => void;
	public InitVel = 0;
	public InitArc = 170;
	constructor(origin: CFrame, length: number) {
		this.solverSigleton = new MathSolver(0.4, length, 9.8 * 10);

		this.model = new Instance("Model");
		this.model.Name = "MathSolver";

		const part = this.easypart(new Vector3(1, length, 1));

		this.pivotPart = new PivotPart(part, origin, new Vector3(0, -0.5, 0));

		const disPart = this.easypart(new Vector3(1, 1, 1));
		this.velDisplay = new PivotPart(disPart, new CFrame(12, 1, 12), new Vector3(-0.5, 0, 0));
		this.velDisplay.part.Parent = Workspace;
		this.model.PrimaryPart = part;
		this.model.Parent = Workspace;

		const [tups, update] = createBinding(
			new Map<string, number>([
				["Time", 0],
				["Velocity", 0],
			]),
		);
		this.updateT = update;

		[this.totalTime, this.updateTotalTime] = createBinding(50);

		//UI Part smh
		this.UIHandler = Roact.mount(
			<ExecutorUI
				onStart={() => {
					this.render();
				}}
				onStop={() => {
					this.solverSigleton.StopSimulation();
				}}
				changed={(t, val) => {
					switch (t) {
						case "Gravity":
							this.solverSigleton.g = val;
							break;
						case "AirResistance":
							this.solverSigleton.mu = val;
							break;
						case "InitialVelocity":
							this.InitVel = val;
							break;
						case "InitialAngle":
							this.InitArc = val;
							break;
						case "TotalTime":
							this.updateTotalTime(val);
						default:
							break;
					}
				}}
				time={tups.map((v) => {
					return v.get("Time") as number;
				})}
				velocity={tups.map((v) => {
					return v.get("Velocity") as number;
				})}
				totalTime={this.totalTime.map((v) => {
					return v * 10;
				})}
			/>,
			Players.LocalPlayer.WaitForChild("PlayerGui"),
			"The UI!",
		);
	}

	private easypart(size: Vector3): Part {
		const part = new Instance("Part");
		part.Size = size;
		part.Anchored = true;
		part.TopSurface = Enum.SurfaceType.SmoothNoOutlines;
		part.BottomSurface = Enum.SurfaceType.SmoothNoOutlines;
		part.Parent = this.model;
		part.Material = Enum.Material.Neon;
		return part;
	}
	/**
	 * render
	 */
	public render() {
		this.solverSigleton.Simulate(
			math.rad(this.InitArc),
			this.InitVel,
			this.totalTime.getValue(),
			(arc, vel, acc, t) => {
				this.setAngle(arc);
				const clamped = math.clamp(math.abs(vel), 0, 1);
				this.pivotPart.part.Color = new Color3(0.29, 0.29, 0.77).Lerp(new Color3(0.75, 0.51, 0.67), clamped);
				this.velDisplay.part.Size = new Vector3(math.abs(vel) * 12, 1, 1);
				this.updateT(
					new Map<string, number>([
						["Time", math.floor(t * 10)],
						["Velocity", vel],
					]),
				);
			},
		);
	}

	private setAngle(arc_rad: number) {
		this.pivotPart.transform_absolute(CFrame.Angles(0, 0, arc_rad));
	}
}

export = new Executor(new CFrame(0, 14, 12), 11);
