/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.test.json'
		}
	},
	testMatch: [ "./**/*.test.ts" ],
	collectCoverage: true,
	coverageReporters: [ "lcov", "html", "text" ],
	collectCoverageFrom: [
		'src/**/*.ts',
	],
};
