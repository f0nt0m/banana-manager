export default {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};