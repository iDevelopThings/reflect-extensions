import {DescriptorInfo} from "./declaration";
import {ReflectBase} from "./ReflectBase";
import {ReflectFunction} from "./ReflectFunction";

function isPropertyLike(key: string, descriptor: PropertyDescriptor) {
	if (key === 'constructor') {
		return false;
	}

	if (ReflectFunction.isFunction(descriptor.value)) {
		return false;
	}

	return true;
}

export class ReflectObject<T extends object = {}> extends ReflectBase {
	private instanceDescriptors: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [p: string]: PropertyDescriptor } = {} as any;
	private descriptors: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [p: string]: PropertyDescriptor }         = {} as any;

	getDescriptors(ignoreCache: boolean = false) {
		if (this.descriptors) return this.descriptors;

		return this.descriptors = Object.getOwnPropertyDescriptors(this.thing) as any;
	}

	getInstanceDescriptors(ignoreCache: boolean = false) {
		if (this.instanceDescriptors) return this.instanceDescriptors;

		return this.instanceDescriptors = Object.getOwnPropertyDescriptors(this.getPrototype()) as any;
	}

	getAllDescriptors(ignoreCache: boolean = false) {
		if (!(this.thing as any)?.prototype) {
			return Object.assign({}, Object.getOwnPropertyDescriptors(this.thing), Object.getOwnPropertyDescriptors(this.getPrototype()));
		}

		return Object.assign({}, this.getInstanceDescriptors(ignoreCache), this.getDescriptors(ignoreCache));
	}

	getPrototype() {
		let proto = Reflect.getPrototypeOf(this.thing);
		if (proto === Function.prototype) {
			return (this.thing as any).prototype;
		}

		return proto;
	}

	public static getPrototypeOf<T>(thing: T): T | any {
		return new ReflectObject(thing as any).getPrototype();
	}

	public hasProperty(name: string) {
		return Reflect.has(this.thing, name);
	}

	public getPropertyValue(name: string) {
		return this.thing[name];
	}

	public setPropertyValue(name: string, value: any) {
		this.thing[name] = value;
	}

	public getPropertyNames() {
		const descriptors = this.getAllDescriptors();

		return Object.entries(descriptors).reduce((acc, [key, descriptor]) => {
			if (isPropertyLike(key, descriptor)) {
				acc.push(key);
			}
			return acc;
		}, []);
	}

	public getPropertyDescriptors(): { [key: string]: PropertyDescriptor } {
		return Object.entries(this.getAllDescriptors()).reduce((descriptors, [key, value]) => {
			if (isPropertyLike(key, value)) {
				descriptors[key] = value;
			}

			return descriptors;
		}, {});
	}

	public deleteKey(key: string) {
		let deleted = false;
		if (Reflect.has(this.thing, key)) {
			Reflect.deleteProperty(this.thing, key);
			deleted = true;
		}

		if (Reflect.has(this.getPrototype(), key)) {
			Reflect.deleteProperty(this.getPrototype(), key);
			deleted = true;
		}

		if (this.descriptors[key]) delete this.descriptors[key];
		if (this.instanceDescriptors[key]) delete this.instanceDescriptors[key];

		return deleted;
	}

	public addProperty(name: string, value: any, descriptor?: DescriptorInfo) {
		if (this.hasProperty(name)) {
			throw new Error(`Property ${name} already exists on ${this.thing}`);
		}

		Reflect.defineProperty(this.getPrototype(), name, {
			value,
			writable     : descriptor?.writable ?? true,
			enumerable   : descriptor?.enumerable ?? true,
			configurable : descriptor?.configurable ?? true,
		});
	}

	public addGetter(name: string, getter: () => any, descriptor?: DescriptorInfo) {
		if (this.hasProperty(name)) {
			throw new Error(`Property ${name} already exists on ${this.thing}`);
		}

		const currentDescriptor = this.getDescriptors()[name];

		Reflect.defineProperty(this.getPrototype(), name, {
			set          : currentDescriptor?.set,
			get          : getter,
			enumerable   : descriptor?.enumerable ?? true,
			configurable : descriptor?.configurable ?? true,
		});
	}

	public addSetter(name: string, setter: (value: any) => void, descriptor?: DescriptorInfo) {
		if (this.hasProperty(name)) {
			throw new Error(`Property ${name} already exists on ${this.thing}`);
		}

		const currentDescriptor = this.getDescriptors()[name];

		Reflect.defineProperty(this.getPrototype(), name, {
			set          : setter,
			get          : currentDescriptor?.get,
			enumerable   : descriptor?.enumerable ?? true,
			configurable : descriptor?.configurable ?? true,
		});
	}

	public addAccessor(name: string, getter: () => any, setter: (value: any) => void, descriptor?: DescriptorInfo) {
		if (this.hasProperty(name)) {
			throw new Error(`Property ${name} already exists on ${this.thing}`);
		}

		Reflect.defineProperty(this.getPrototype(), name, {
			set          : setter,
			get          : getter,
			enumerable   : descriptor?.enumerable ?? true,
			configurable : descriptor?.configurable ?? true,
		});
	}

}
