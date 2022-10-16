/// <reference types="vitest" />

import {describe} from "vitest";
import {reflect} from "../index";
import {ReflectClass} from '../ReflectClass';

describe('ReflectClass', () => {
	class Test1 {}

	class Test2 extends Test1 {}

	test('getting constructor of class', async () => {
		const reflectClass = new ReflectClass(Test2);
		expect(reflectClass.getConstructor()).toBe(Test2);
		expect(ReflectClass.getConstructorOf(Test2)).toBe(Test2);
		expect(ReflectClass.getConstructorOf(Test1)).toBe(Test1);
		expect(ReflectClass.getConstructorOf(new Test1())).toBe(Test1);
		expect(ReflectClass.getConstructorOf(new Test2())).toBe(Test2);
	});

	test('getting extensions of class', async () => {
		const reflectClass = new ReflectClass(Test2);
		expect(reflect(Test2).class().getExtensions()).toEqual([Test1]);
		expect(reflect(Test1).class().getExtensions()).toEqual([]);
	});

	test('checking if class extends another class', async () => {
		expect(reflect(Test2).class().extends(Test1)).toBe(true);
		expect(reflect(Test1).class().extends(Test2)).toBe(false);
	});

	test('checking if class has method', async () => {
		class Test {
			test() {}
		}

		expect(reflect(Test).class().hasMethod('test')).toBe(true);
		expect(reflect(Test).class().hasMethod('test2')).toBe(false);
	});

	test('getting method', async () => {
		class Test {
			test() {}
		}

		expect(reflect(Test).class().getMethod('test')).toBe(Test.prototype.test);
		expect(reflect(new Test()).class().getMethod('test')).toBe(Test.prototype.test);
		expect(reflect(Test).class().getMethod('test2')).toBe(undefined);
	});

	test('getting methods', async () => {
		class Test {
			test() {}

			test2() {}
		}

		expect(reflect(Test).class().getMethods()).toEqual({
			test  : Test.prototype.test,
			test2 : Test.prototype.test2,
		});
	});

	test('getting methods from instance', async () => {
		class Test {
			test() {}

			test2() {}
		}

		const m = reflect(new Test()).class().getMethods();
		expect(reflect(new Test()).class().getMethods()).toEqual({
			test  : Test.prototype.test,
			test2 : Test.prototype.test2,
		});
	});

	test('adding method', async () => {
		class Test {
			test() {}
		}

		reflect(Test).class().addMethod('test2', function () {
			return 'test2';
		});

		expect(reflect(Test).class().hasMethod('test2')).toBe(true);
		expect(reflect(Test).class().getMethod('test2')).toBe((Test as any).prototype.test2);
	});

	test('adding method to instance', async () => {
		class Test {
			test() {}
		}

		const inst = new Test();

		reflect(inst).class().addMethod('test2', function () {
			return 'test2';
		});

//		expect(reflect(new Test()).class().hasMethod('test2')).toBe(true);
//		expect(reflect(inst).class().hasMethod('test2')).toBe(true);
//		expect(reflect(Test).class().hasMethod('test2')).toBe(true);
//		expect(reflect(inst).class().getMethod('test2')).toBe((Test as any).prototype.test2);
	});

});

