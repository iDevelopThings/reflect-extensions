import {ReflectApi} from "./Reflect";

export function reflect<T extends any>(thing: T): ReflectApi<T> {
	return new ReflectApi<T>(thing);
}


export {ReflectApi} from "./Reflect";
export {ReflectClass} from "./ReflectClass";
export {ReflectFunction} from "./ReflectFunction";
export {ReflectObject} from "./ReflectObject";
