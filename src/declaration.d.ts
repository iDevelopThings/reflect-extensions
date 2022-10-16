declare type ClassType<T = any> = new (...args: any[]) => T;

declare type DescriptorInfo = {
	configurable?: boolean;
	enumerable?: boolean;
	writable?: boolean;
}
