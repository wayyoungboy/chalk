import process from 'node:process';
import test from 'ava';
import {createSupportsColor} from '../source/vendor/supports-color/index.js';

const withEnv = (environment, function_) => {
	const previousEnvironment = {};

	for (const key of Object.keys(environment)) {
		previousEnvironment[key] = process.env[key];
		process.env[key] = environment[key];
	}

	try {
		return function_();
	} finally {
		for (const key of Object.keys(environment)) {
			if (previousEnvironment[key] === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = previousEnvironment[key];
			}
		}
	}
};

test('FORCE_COLOR overrides COLORTERM=truecolor', t => {
	withEnv({FORCE_COLOR: '1', COLORTERM: 'truecolor', TERM: 'xterm-256color'}, () => {
		t.deepEqual(createSupportsColor({isTTY: true}), {
			level: 1,
			hasBasic: true,
			has256: false,
			has16m: false,
		});
	});

	withEnv({FORCE_COLOR: '2', COLORTERM: 'truecolor', TERM: 'xterm-256color'}, () => {
		t.deepEqual(createSupportsColor({isTTY: true}), {
			level: 2,
			hasBasic: true,
			has256: true,
			has16m: false,
		});
	});
});
