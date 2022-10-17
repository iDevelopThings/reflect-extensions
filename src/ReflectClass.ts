import {ClassType, DescriptorInfo} from "./declaration";
import {ReflectFunction} from "./ReflectFunction";
import {ReflectObject} from "./ReflectObject";

const objectProto = Reflect.getPrototypeOf(Object);

export class ReflectClass<T extends object = {}> extends ReflectObject<T> {

	constructor(public thing: T) {
		super(thing);
	}

	isInstantiated() {
		return this.thing !== this.getConstructor();
	}

	getConstructor(): ClassType<T> {
		return ReflectFunction.isFunction(this.thing)
			? <any>this.thing
			: <any>this.thing.constructor;
	}

	public static getConstructorOf<T extends object = {}>(thing: T): ClassType<T> {
		return new ReflectClass<T>(thing).getConstructor();
	}

	getExtensions(): ClassType<any>[] {
		let item: Object = this.getConstructor();

		const extensions = [];

		do {
			item = Reflect.getPrototypeOf(item);
			if (item !== Object.prototype && item !== Function.prototype && item !== undefined) {
				extensions.push(item);
			} else {
				item = undefined;
			}
		} while (item !== undefined);

		return extensions;
	}

	extends<TT extends object = {}>(baseType: TT) {
		let item: Object = this.getConstructor();
		let base         = ReflectClass.getConstructorOf(baseType);

		do {
			if (item === base) return true;
			item = Reflect.getPrototypeOf(item);
		} while (item !== Object.prototype && item !== objectProto);

		return false;
	}

	hasMethod(name: string) {
		return ReflectFunction.isFunction(this.getPrototype()[name]);
	}

	getMethod(name: string) {
		const method = this.getPrototype()[name];
		return ReflectFunction.isFunction(method) ? method : undefined;
	}

	getMethods() {
		return Reflect.ownKeys(this.getPrototype()).reduce((methods, key) => {
			if (key === 'constructor') return methods;

			if (ReflectFunction.isFunction(this.getPrototype()[key])) {
				methods[key] = this.getPrototype()[key];
			}
			return methods;
		}, {});
	}

	getMethodNames() {
		return Reflect.ownKeys(this.thing).filter(key => ReflectFunction.isFunction(this.thing[key]));
	}

	getMethodDescriptors() {
		return Reflect.ownKeys(this.thing).reduce((descriptors, key) => {
			if (ReflectFunction.isFunction(this.thing[key])) {
				descriptors[key] = Reflect.getOwnPropertyDescriptor(this.thing, key);
			}
			return descriptors;
		}, {});
	}

	method(name: string): ReflectFunction {
		const method = this.getMethod(name);
		if (!method) {
			throw new Error(`Cannot find method ${name} on ${this.getConstructor().name}.`);
		}

		return new ReflectFunction(method);
	}

	//	callMethod(instance:any, name:)

	addMethod(name: string, method: Function | any, descriptorInfo: DescriptorInfo = {}) {
		if (this.getInstanceDescriptors()[name]) {
			throw new Error(`Cannot add method ${name} to ${this.getConstructor().name} because it already exists.`);
		}

		if (!ReflectFunction.isFunction(method)) {
			throw new Error(`Cannot add method ${name} to ${this.getConstructor().name} because it is not a function.`);
		}

		Reflect.defineProperty(this.getPrototype(), name, {
			value        : method.bind(this.thing),
			writable     : descriptorInfo.writable,
			enumerable   : descriptorInfo.enumerable,
			configurable : descriptorInfo.configurable,
		});

		this.getInstanceDescriptors(true);

		return this;
	}

	addStaticMethod(name: string, method: Function | any, descriptorInfo: DescriptorInfo = {}) {
		if (this.getDescriptors()[name]) {
			throw new Error(`Cannot add method ${name} to ${this.getConstructor().name} because it already exists.`);
		}

		if (!ReflectFunction.isFunction(method)) {
			throw new Error(`Cannot add method ${name} to ${this.getConstructor().name} because it is not a function.`);
		}

		Reflect.defineProperty(this.thing, name, {
			value        : method.bind(this.thing),
			writable     : descriptorInfo.writable,
			enumerable   : descriptorInfo.enumerable,
			configurable : descriptorInfo.configurable,
		});

		this.getInstanceDescriptors(true);

		return this;
	}
}
