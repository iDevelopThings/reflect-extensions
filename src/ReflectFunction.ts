import {getArgs} from 'reflect-args';

export class ReflectFunction<T = any> {

	constructor(public thing: T) { }

	is(): boolean {
		const value = Reflect.apply(Object.prototype.toString, this.thing, []);
		return this.thing != null && (typeof this.thing === 'object' || typeof this.thing === 'function') &&
			(value === '[object Function]' || value === '[object AsyncFunction]' || value === '[object GeneratorFunction]' || value === '[object Proxy]');
	}

	public static isFunction(thing: any): boolean {
		return new ReflectFunction(thing).is();
	}

	getParams(): { name: string, value: any }[] {
		const params = [];
		const args   = getArgs(this.thing) as Map<string, any>;

		for (let [key, value] of args.entries()) {
			params.push({name : key, value : value});
		}
		return params;
	}

	getParamNames() {
		return this.getParams().map(param => param.name);
	}

}
