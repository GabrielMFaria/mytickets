export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/tests/**/*.test.ts'],
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',          
    '!src/**/*.d.ts',       
    '!src/**/index.ts',     
    '!tests/setup.ts',      
    '!tests/global.d.ts',
    '!src/server.ts',   
  ],
  coverageReporters: ['text', 'lcov', 'html'],
};
