import {getArgs} from 'reflect-args';
import {FunctionParameter} from "./declaration";
import {ReflectBase} from "./ReflectBase";
import {ReflectFunctionCallBuilder} from "./ReflectFunctionCallBuilder";

export class ReflectFunction<T = any> extends ReflectBase {

	private paramsCache: FunctionParameter[];

	is(): boolean {
		const value = Reflect.apply(Object.prototype.toString, this.thing, []);
		return this.thing != null && (typeof this.thing === 'object' || typeof this.thing === 'function') &&
			(value === '[object Function]' || value === '[object AsyncFunction]' || value === '[object GeneratorFunction]' || value === '[object Proxy]');
	}

	public static isFunction(thing: any): boolean {
		return new ReflectFunction(thing).is();
	}

	getParams(): FunctionParameter[] {
		if (this.paramsCache) return this.paramsCache;

		const params = [];
		const args   = getArgs(this.thing) as Map<string, any>;

		for (let [key, value] of args.entries()) {
			params.push({name : key, value : value});
		}

		return this.paramsCache = params;
	}

	getParamNames() {
		return this.getParams().map(param => param.name);
	}

	build(): ReflectFunctionCallBuilder {
		return new ReflectFunctionCallBuilder(this);
	}

	call<T = any>(...args: any[]): T {
		return Reflect.apply(this.thing, undefined, args);
	}

	callWithInstance<T = any>(instance: any, ...args: any[]): T {
		return Reflect.apply(this.thing, instance, args);
	}

}
