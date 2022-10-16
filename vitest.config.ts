/// <reference types="vitest" />

import path from "path";
import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins : [],
	test    : {
		globals     : true,
	},
});
