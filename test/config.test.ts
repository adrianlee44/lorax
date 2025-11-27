import {readFile} from 'node:fs/promises';
import Config from '../src/lib/config.js';
import mock from 'mock-fs';

let config: Config;

const validConfigData = {
  version: 2,
  issue: '/issues/%s',
  commit: '/commit/%s',
  types: {
    fix: {
      title: 'Bug Fixes',
      regex: '^fix',
    },
    feature: {
      title: 'Features',
      regex: '^feat(ure)?',
    },
    breaking: {
      title: 'Breaking Changes',
      regex: 'BREAKING',
    },
    refactor: {
      title: 'Optimizations',
      regex: '^refactor',
    },
    test: {
      title: 'Testing',
      regex: '^test',
    },
    doc: {
      title: 'Documentation',
      regex: '^doc',
    },
  },
  url: 'https://example.com/repo',
};

beforeEach(() => {
  // Set up the mock file system
  mock({
    'test/test_config.json': JSON.stringify(validConfigData, null, '  '),
    'test/invalid.json': '{\n  "invalid"\n}',
  });

  config = new Config('./test/test_config.json');
});

afterAll(() => {
  // Restore the real file system after all tests
  mock.restore();
});

afterEach(() => {
  config.reset();
});

test('default', () => {
  const configObj = new Config('/random.json');
  expect(Object.keys(configObj.config.types).length).toBe(6);
  expect(configObj.config.url).toBeFalsy();
});

test('invalid file', () => {
  const configObj = new Config('/null');
  expect(configObj.jsonData).toEqual({});
});

test('bad data in valid file', () => {
  const oldConsoleError = console.error;
  let errorMsg: string | undefined;

  console.error = function (message: string) {
    errorMsg = message;
  };

  const configObj = new Config('test/invalid.json');
  expect(configObj.jsonData).toEqual({});
  expect(errorMsg).toBe('Invalid invalid.json');

  console.error = oldConsoleError;
});

test('load lorax json', () => {
  expect(config.config.url).toBe('https://example.com/repo');
});

test('get', () => {
  expect(config.get('url')).toBe('https://example.com/repo');
});

test('getTypeByInput', () => {
  expect(config.getTypeByInput('fix')).toBe('fix');
});

test('set', () => {
  config.set('issue', '/issues/test/%s');
  expect(config.get('issue')).toBe('/issues/test/%s');
});

test('set object', () => {
  const configObj = new Config('./test/test_config.json');
  configObj.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });
  expect(configObj.get('issue')).toBe('/issues/test/%s');
  expect(configObj.get('commit')).toBe('/commit/test/%s');
});

test('custom property', () => {
  expect(config.custom).toBeTruthy();
});

test('custom property false', () => {
  const configObj = new Config('/random.json');
  expect(configObj.custom).toBe(false);
});

test('write back to config', async () => {
  config.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });

  config.updatePath('test_config_output.json');
  config.write();

  const data = await readFile('test_config_output.json');
  expect(data).toBeTruthy();
});

test('reset', () => {
  config.set('url', 'https://github.com/');
  expect(config.get('url')).not.toBe('https://example.com/repo');

  config.reset();

  expect(config.get('url')).toBe('https://example.com/repo');
});
