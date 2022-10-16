/// <reference types="vitest" />

import {describe} from "vitest";
import {reflect} from "../index";
import {ReflectFunction} from '../ReflectFunction';

describe('ReflectFunction', () => {

	test('getting params', async () => {
		function test(a: any, b: any) {}

		function testTwo(a: any = 'a', b: any = 'b') {}

		expect(reflect(test).function().getParams()).toEqual([
			{name : 'a', value : undefined},
			{name : 'b', value : undefined},
		]);

		expect(reflect(testTwo).function().getParams()).toEqual([
			{name : 'a', value : 'a'},
			{name : 'b', value : 'b'},
		]);
	});

	test('getting param names', async () => {
		function test(a: any, b: any) {}

		expect(reflect(test).function().getParamNames()).toEqual(['a', 'b']);
	});

});

