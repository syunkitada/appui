// https://jestjs.io/docs/ja/getting-started
// https://typescript-jp.gitbook.io/deep-dive/intro-1/jest
module.exports = {
  roots: [`${__dirname}/src`],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
  },
  setupFiles: ["<rootDir>/tests/test-env.js"]
};
