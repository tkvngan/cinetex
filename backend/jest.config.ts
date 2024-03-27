// @ts-ignore
import type {Config} from 'jest';

const config: Config = {
    maxConcurrency: 1,
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globalSetup: '<rootDir>/src/test/setup.ts',
    globalTeardown: '<rootDir>/src/test/teardown.ts',
    maxWorkers: 1,
};

export default config;
