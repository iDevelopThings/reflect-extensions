import {ReflectApi} from "./Reflect";

export function reflect<T extends any>(thing: T): ReflectApi<T> {
	return new ReflectApi<T>(thing);
}
