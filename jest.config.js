module.exports = {
  testEnvironment: 'node',
  runner: 'jest-light-runner',
  setupFiles: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  verbose: true
};
