import { Binding, Tree } from "@rbxts/roact";

type BindsAll<T> = {
	[P in keyof T]: T[P] | Binding<T[P]>;
};

export { BindsAll };
