import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.{spec,test}.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

export default config;
