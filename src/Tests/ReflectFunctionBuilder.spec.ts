/// <reference types="vitest" />

import {describe} from "vitest";
import {reflect} from "../index";

describe('ReflectFunctionBuilder', () => {

	test('calling a function without an instance', () => {
		const reflectFunction = reflect(() => 1).function();
		const result          = reflectFunction.call();
		expect(result).toBe(1);

		const reflectFunctionWithArg = reflect((number: number) => number).function();
		const resultWithArg          = reflectFunction.call(1);
		expect(resultWithArg).toBe(1);
	});

	test('calling a function with an instance', () => {
		class TestClass {
			public number: number;

			public test() {
				return 1;
			}

			public setNumber(number: number) {
				this.number = number;
			}

			public getNumber() {
				return this.number;
			}
		}

		const reflectFunction = reflect(TestClass.prototype.test).function();
		const result          = reflectFunction.callWithInstance(new TestClass());
		expect(result).toBe(1);

		const reflectFunctionWithArg = reflect(TestClass.prototype.setNumber).function();
		const testClass              = new TestClass();
		reflectFunctionWithArg.callWithInstance(testClass, 1);
		expect(testClass.number).toBe(1);

		const reflectFunctionWithArg2 = reflect(TestClass.prototype.getNumber).function();
		const resultWithArg           = reflectFunctionWithArg2.callWithInstance(testClass);
		expect(resultWithArg).toBe(1);
	});

	test('calling a function with an instance using the builder', () => {
		class TestClass {
			public number: number;

			public test() {
				return 1;
			}

			public setNumber(number: number) {
				this.number = number;
				return true;
			}

			public getNumber() {
				return this.number;
			}
		}

		const testClass         = new TestClass();
		const testFunction      = reflect(testClass).class().method('test').build();
		const setNumberFunction = reflect(testClass).class().method('setNumber').build();
		const getNumberFunction = reflect(testClass).class().method('getNumber').build();

		expect(testFunction.instance(testClass).call()).toBe(1);
		expect(setNumberFunction.instance(testClass).parameters([1]).call()).toBe(true);
		expect(testClass.number).toBe(1);
		expect(getNumberFunction.instance(testClass).call()).toBe(1);

	});

	test('calling function via builder with undefined as a param', () => {
		const testFunction      = reflect(() => 1).function().build();
		const testFunctionTwo   = reflect((args: any) => args).function().build();
		const testFunctionThree = reflect((obj: { [key: string]: any }) => obj).function().build();

		expect(testFunction.parameters(undefined).call()).toBe(1);
		expect(testFunctionTwo.parameters(undefined).call()).toBe(undefined);
		expect(testFunctionThree.parameters([{some : 'value'}]).call()).toStrictEqual({some : 'value'});
		expect(testFunctionTwo.parameters([undefined]).call()).toStrictEqual(undefined);
	});
	test('proxied method call', () => {
		const obj: any = {};
		const original = function (message: string) {
			return message;
		};

		Object.defineProperty(obj, 'test', {
			value : (...args) => {
				const handler = reflect(original).function().build();
				return handler.parameters(args).call();
			}
		});

		const res = obj.test('hello world');
		expect(res).toBe('hello world');
	});

});

