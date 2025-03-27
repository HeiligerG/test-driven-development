/** @type {import('jest').Config} */
module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testEnvironment: "node"
  };
  