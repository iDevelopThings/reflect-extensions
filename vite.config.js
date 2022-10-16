import {defineConfig} from 'vite';

export default defineConfig({
	plugins : [],
	build   : {
		outDir    : 'dist',
		sourcemap : true,
		lib       : {
			name     : 'ReflectExtensions',
			entry    : './src/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs', 'umd', 'iife'],
		},
	},
});
