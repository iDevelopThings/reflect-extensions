export type ClassType<T = any> = new (...args: any[]) => T;

export type DescriptorInfo = {
	configurable?: boolean;
	enumerable?: boolean;
	writable?: boolean;
}


export type FunctionParameter = { name: string, value: any };
