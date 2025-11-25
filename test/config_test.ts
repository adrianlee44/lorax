import {readFile} from 'node:fs/promises';
import Config from '../src/lib/config.js';
import anyTest, {TestFn} from 'ava';
import mock from 'mock-fs';

const test = anyTest as unknown as TestFn<{config: Config}>;

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

test.before((t) => {
  // Set up the mock file system
  mock({
    'test/test_config.json': JSON.stringify(validConfigData, null, '  '),
    'test/invalid.json': '{\n  "invalid"\n}',
  });

  t.context.config = new Config('./test/test_config.json');
});

test.after(() => {
  // Restore the real file system after all tests
  mock.restore();
});

test.afterEach((t) => {
  t.context.config.reset();
});

test('default', (t) => {
  const configObj = new Config('/random.json');
  t.is(Object.keys(configObj.config.types).length, 6);
  t.falsy(configObj.config.url);
});

test('invalid file', (t) => {
  const configObj = new Config('/null');
  t.deepEqual(configObj.jsonData, {});
});

test.serial('bad data in valid file', (t) => {
  const oldConsoleError = console.error;
  let errorMsg: string | undefined;

  console.error = function (message: string) {
    errorMsg = message;
  };

  const configObj = new Config('test/invalid.json');
  t.deepEqual(configObj.jsonData, {});
  t.is(errorMsg, 'Invalid invalid.json');

  console.error = oldConsoleError;
});

test('load lorax json', (t) => {
  t.is(t.context.config.config.url, 'https://example.com/repo');
});

test('get', (t) => {
  t.is(t.context.config.get('url'), 'https://example.com/repo');
});

test('getTypeByInput', (t) => {
  t.is(t.context.config.getTypeByInput('fix'), 'fix');
});

test('set', (t) => {
  t.context.config.set('issue', '/issues/test/%s');
  t.is(t.context.config.get('issue'), '/issues/test/%s');
});

test('set object', (t) => {
  const configObj = new Config('./test/test_config.json');
  configObj.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });
  t.is(configObj.get('issue'), '/issues/test/%s');
  t.is(configObj.get('commit'), '/commit/test/%s');
});

test('custom property', (t) => {
  t.truthy(t.context.config.custom);
});

test('custom property false', (t) => {
  const configObj = new Config('/random.json');
  t.is(configObj.custom, false);
});

test('write back to config', async (t) => {
  t.context.config.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });

  t.context.config.updatePath('test_config_output.json');
  t.context.config.write();

  const data = await readFile('test_config_output.json');
  t.truthy(data);
});

test('reset', (t) => {
  t.context.config.set('url', 'https://github.com/');
  t.not(t.context.config.get('url'), 'https://example.com/repo');

  t.context.config.reset();

  t.is(t.context.config.get('url'), 'https://example.com/repo');
});
