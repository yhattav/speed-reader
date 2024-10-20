import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const sharedPlugins = [
	svelte({
		preprocess: sveltePreprocess({ sourceMap: !production }),
		compilerOptions: {
			dev: !production
		}
	}),
	css({ output: 'content.css' }),
	resolve({
		browser: true,
		dedupe: ['svelte']
	}),
	commonjs(),
	typescript({
		sourceMap: !production,
		inlineSources: !production
	}),
	!production && serve(),
	!production && livereload('public'),
	production && terser()
];

export default [
	{
		input: 'src/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/bundle.js'
		},
		plugins: sharedPlugins,
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'src/content.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'content',
			file: 'public/content.js'
		},
		plugins: sharedPlugins,
		watch: {
			clearScreen: false
		}
	}
];
