import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node", // use node instead of jsdom
  transform: {
    ...tsJestTransformCfg, // lets jest use typescript
  }
};