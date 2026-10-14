import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import Config from '../src/lib/config.js';

let config: Config;
let tmpDir: string;
let configPath: string;

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

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), 'lorax-config-'));
  configPath = join(tmpDir, 'test_config.json');

  await writeFile(configPath, JSON.stringify(validConfigData, null, '  '));
  await writeFile(join(tmpDir, 'invalid.json'), '{\n  "invalid"\n}');

  config = new Config(configPath);
});

afterEach(async () => {
  config.reset();
  await rm(tmpDir, {recursive: true, force: true});
});

test('default', async () => {
  const defaultPath = join(tmpDir, 'default.json');
  await writeFile(defaultPath, JSON.stringify({version: Config.VERSION}));
  const configObj = new Config(defaultPath);
  expect(Object.keys(configObj.config.types).length).toBe(6);
  expect(configObj.config.url).toBeFalsy();
});

test('missing file throws', () => {
  expect(() => new Config(join(tmpDir, 'null'))).toThrow(
    'Configuration file not found'
  );
});

test('missing relative path throws', () => {
  expect(() => new Config('./does/not/exist.json')).toThrow(
    'Configuration file not found: ./does/not/exist.json'
  );
});

test('missing file name throws', () => {
  expect(() => new Config('does-not-exist.json')).toThrow(
    'Configuration file not found: does-not-exist.json'
  );
});

test('bad data in valid file', () => {
  const oldConsoleError = console.error;
  let errorMsg: string | undefined;

  console.error = function (message: string) {
    errorMsg = message;
  };

  const configObj = new Config(join(tmpDir, 'invalid.json'));
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
  const configObj = new Config(configPath);
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

test('write back to config', async () => {
  config.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });

  const outputPath = join(tmpDir, 'test_config_output.json');
  config.updatePath(outputPath);
  config.write();

  const data = JSON.parse(await readFile(outputPath, 'utf-8'));
  expect(data.issue).toBe('/issues/test/%s');
  expect(data.commit).toBe('/commit/test/%s');
});

test('reset', () => {
  config.set('url', 'https://github.com/');
  expect(config.get('url')).not.toBe('https://example.com/repo');

  config.reset();

  expect(config.get('url')).toBe('https://example.com/repo');
});
