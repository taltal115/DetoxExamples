function getModuleNameMapper() {
  const { pathsToModuleNameMapper } = require('ts-jest/utils');
  const fs = require('fs');
  const path = require('path');
  const JSON5 = require('json5');
  const data = fs.readFileSync(path.resolve(__dirname, './tsconfig.json'));
  const {
    compilerOptions: { paths: tsconfigPaths },
  } = JSON5.parse(data);

  return pathsToModuleNameMapper(tsconfigPaths, { prefix: '<rootDir>/' });
}

module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: ['node_modules/(?!(jest-)?react-native' +
  '|@react-native-community' +
  '|@react-navigation' +
  '|react-navigation-redux-helpers' +
  '|rn-swipe-button' +
  ')'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: [
    './jest-config/animation-config.js',
    './jest-config/enzyme-config.js',
    './jest-config/jest-modules-mock.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)', '!**/__tests__/**/*.mock.[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.mock.{ts,tsx,json}', '!**/*.d.ts', '!<rootDir>/src/data/mocks/', '!<rootDir>/e2e/**/*.*'],
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/html-report',
        expand: false,
        openReport: false,
      },
    ],
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  moduleNameMapper: getModuleNameMapper(),
  cacheDirectory: '.jest_cache',
};
