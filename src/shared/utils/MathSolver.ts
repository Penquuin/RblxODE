import { RunService } from "@rbxts/services";

class MathSolver {
	public mu: number;
	private l: number;
	public g: number;
	private running = false;
	private static used = false;
	constructor(airResistance: number, Length: number, Gravity: number) {
		if (MathSolver.used) {
			error("MathSolver has already been initalized!");
			return;
		}
		this.mu = airResistance;
		this.l = Length;
		this.g = Gravity;
	}
	private getDoubleDot(theta: number, thetaDot: number): number {
		return -this.mu * thetaDot - (math.sin(theta) * this.g) / this.l;
	}
	/**
	 * Simulate
	 */
	public Simulate(
		Theta0: number,
		ThetaDot0: number,
		toTime: number,
		callback: (theta: number, thetaDot: number, thetaDoubleDot: number, t: number) => void,
	): void {
		this.running = true;
		const deltaTime = 0.01;
		let theta = Theta0;
		let thetaDot = ThetaDot0;
		for (let t = 0; t < toTime; t += deltaTime) {
			if (!this.running) {
				return;
			}
			const tendTo = this.getDoubleDot(theta, thetaDot);
			theta += thetaDot * deltaTime;
			thetaDot += tendTo * deltaTime;
			callback(theta, thetaDot, tendTo, t);
			RunService.RenderStepped.Wait();
		}
	}
	/**
	 * This stops the simulation!
	 */
	public StopSimulation(): void {
		this.running = false;
	}
}

export { MathSolver };
