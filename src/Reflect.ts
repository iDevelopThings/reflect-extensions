import {ReflectClass} from "./ReflectClass";
import {ReflectFunction} from "./ReflectFunction";
import {ReflectObject} from "./ReflectObject";

export class ReflectApi<T extends any = any> {
	constructor(public thing: T) {}

	isObjectLike(thing: any): thing is object {
		return this.thing != null && typeof this.thing === 'object';
	}

	class(): ReflectClass<any> {
		return new ReflectClass<any>(this.thing);
	}

	public object(): ReflectObject<any> {
		return new ReflectObject<any>(this.thing);
	}

	public function(): ReflectFunction<any> {
		return new ReflectFunction<any>(this.thing);
	}
}
