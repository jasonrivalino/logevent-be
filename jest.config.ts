import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  reporters: [
    'default',
    ['jest-sonar-reporter', {
      outputDirectory: 'coverage',
      outputName: 'sonar-report.xml',
    }],
  ],
};

export default config;
