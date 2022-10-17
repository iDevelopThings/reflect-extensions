/// <reference types="vitest" />

import {describe} from "vitest";
import {reflect} from "../index";
import {ReflectFunction} from '../ReflectFunction';

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
		expect(setNumberFunction.instance(testClass).parameters(1).call()).toBe(true);
		expect(testClass.number).toBe(1);
		expect(getNumberFunction.instance(testClass).call()).toBe(1);

	});

});

