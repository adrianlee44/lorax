import type {Config} from 'jest';
import {createDefaultEsmPreset} from 'ts-jest';

const presetConfig = createDefaultEsmPreset();
export default {
  ...presetConfig,
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
} satisfies Config;
