class PivotPart {
	private pivotOrigin: CFrame;
	private pivotRatio: Vector3;
	public part: BasePart;
	/**
	 * absolute transform smh
	 */
	public transform_absolute(offset?: CFrame) {
		const to = this.pivotOrigin.mul(offset || new CFrame());
		this.part.CFrame = to.mul(
			new CFrame(
				this.pivotRatio.X * this.part.Size.X,
				this.pivotRatio.Y * this.part.Size.Y,
				this.pivotRatio.Z * this.part.Size.Z,
			),
		);
	}
	constructor(part: BasePart, origin: CFrame, ratio: Vector3) {
		this.pivotOrigin = origin;
		this.pivotRatio = ratio;
		this.part = part;
		this.transform_absolute();
		this.part.GetPropertyChangedSignal("Size").Connect(() => {
			this.transform_absolute();
		});
	}
}

export { PivotPart };
