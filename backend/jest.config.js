export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(.+?)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['<rootDir>/tests/setup.js']
}; 