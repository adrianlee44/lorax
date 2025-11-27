import type {Config} from 'jest';
import {createDefaultEsmPreset} from 'ts-jest';

const presetConfig = createDefaultEsmPreset();
export default {
  ...presetConfig,
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
} satisfies Config;
