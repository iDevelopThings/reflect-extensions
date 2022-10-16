/// <reference types="vitest" />

import {describe} from "vitest";
import {reflect} from "../index";
import {ReflectObject} from '../ReflectObject';

describe('ReflectObject', () => {

	test('getting prototype of object', async () => {
		class Test {}

		const test = new Test();
		//		expect(reflect(test).object().getPrototype()).toBe(Test.prototype);
		expect(reflect(Test).object().getPrototype()).toBe(Test.prototype);
		//		expect(ReflectObject.getPrototypeOf(test)).toBe(Test.prototype);
		expect(ReflectObject.getPrototypeOf(Test)).toBe(Test.prototype);
	});

	test('has property', async () => {
		class Test {
			public test = 'test';
		}

		const test = new Test();
		expect(reflect(test).object().hasProperty('test')).toBe(true);
		expect(reflect(test).object().hasProperty('test2')).toBe(false);
	});

	test('get property value', async () => {
		class Test {
			public test = 'test';
		}

		const test = new Test();
		expect(reflect(test).object().getPropertyValue('test')).toBe('test');
		expect(reflect(test).object().getPropertyValue('test2')).toBe(undefined);
	});

	test('set property value', async () => {
		class Test {
			public test = 'test';
		}

		const test = new Test();
		expect(reflect(test).object().getPropertyValue('test')).toBe('test');
		reflect(test).object().setPropertyValue('test', 'test2');
		expect(reflect(test).object().getPropertyValue('test')).toBe('test2');
	});

	test('get property names', async () => {
		class TestOne {
			public testProp = 'test';
		}

		class Test extends TestOne {
			public test           = 'test';
			public static testTwo = 'yeet';
		}

		const test = new Test();
		expect(reflect(test).object().getPropertyNames()).toEqual(['testProp', 'test']);
	});

	test('get property descriptors', async () => {
		class Test {
			public test = 'test';
		}

		const test = new Test();
		expect(reflect(test).object().getPropertyDescriptors()).toEqual({test : {value : 'test', writable : true, enumerable : true, configurable : true}});
	});

	test('delete key', async () => {
		class Test {
			public test = 'test';
		}

		const test   = new Test();
		const pnames = reflect(test).object().getPropertyNames();
		expect(reflect(test).object().getPropertyNames()).toEqual(['test']);
		reflect(test).object().deleteKey('test');

		expect(reflect(test).object().getPropertyNames()).toEqual([]);
	});

	test('add property', async () => {
		class Test {}

		const test = new Test();
		expect(reflect(test).object().getPropertyNames()).toEqual([]);
		reflect(test).object().addProperty('test', 'test');
		expect(reflect(test).object().getPropertyNames()).toEqual(['test']);
		expect(reflect(test).object().getPropertyValue('test')).toBe('test');
	});

	test('add getter', async () => {
		class Test {}

		const test = new Test();
		expect(reflect(test).object().getPropertyNames()).toEqual([]);
		reflect(test).object().addGetter('test', () => 'test');
		expect(reflect(test).object().getPropertyNames()).toEqual(['test']);
		expect(reflect(test).object().getPropertyValue('test')).toBe('test');
	});

	test('add setter', async () => {
		class Test {}

		const test = new Test();
		expect(reflect(test).object().getPropertyNames()).toEqual([]);
		reflect(test).object().addSetter('test', (value: string) => 'test');
		expect(reflect(test).object().getPropertyNames()).toEqual(['test']);
		expect(reflect(test).object().getPropertyValue('test')).toBe(undefined);
	});

	test('add getter and setter(accessor)', async () => {
		class Test {}

		const test = new Test();
		expect(reflect(test).object().getPropertyNames()).toEqual([]);
		reflect(test).object().addAccessor('test', () => 'test', (value: string) => 'test');
		const p = reflect(test).object().getPropertyNames();
		expect(reflect(test).object().getPropertyNames()).toEqual(['test']);
		expect(reflect(test).object().getPropertyValue('test')).toBe('test');
	});


});

