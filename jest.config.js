module.exports = {
  "testPathIgnorePatterns": ['/node_modules/', '/build/'],
  "coveragePathIgnorePatterns": ['/node_modules/', '/build/'],
  "roots": [
  	"<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
