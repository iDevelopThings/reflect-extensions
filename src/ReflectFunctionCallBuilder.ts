import {ReflectFunction} from "./ReflectFunction";

export class ReflectFunctionCallBuilder {
	private readonly reflectFunction: ReflectFunction;

	private _instance: any;
	private _parameters: any[] = [];

	constructor(reflectFunction: ReflectFunction) {
		this.reflectFunction = reflectFunction;
	}

	public instance(instance: any) {
		this._instance = instance;
		return this;
	}

	public parameters(...parameters: any[]) {
		this._parameters = parameters;
		return this;
	}

	public call() {
		if(this._instance) {
			return this.reflectFunction.callWithInstance(this._instance, ...this._parameters);
		}
		return this.reflectFunction.call(...this._parameters);
	}


}
