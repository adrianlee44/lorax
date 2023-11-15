import {readFile, unlink} from 'node:fs/promises';
import {Config} from '../src/lib/config.js';
import test from 'ava';

test('default', (t) => {
  const configObj = new Config('random.json');
  t.is(configObj.config.type.length, 6);
  t.falsy(configObj.config.url);
});

test('invalid file', (t) => {
  const configObj = new Config('/null');
  t.deepEqual(configObj.jsonData, {});
});

test.serial('bad data in valid file', (t) => {
  let oldConsoleError = console.error;
  let errorMsg;

  console.error = function (message: string) {
    errorMsg = message;
  };

  const configObj = new Config('test/invalid.json');
  t.deepEqual(configObj.jsonData, {});
  t.is(errorMsg, 'Invalid invalid.json');

  console.error = oldConsoleError;
});

test('load lorax json', (t) => {
  const configObj = new Config();
  t.is(configObj.config.url, 'https://github.com/adrianlee44/lorax');
});

test('get', (t) => {
  const configObj = new Config();
  t.is(configObj.get('url'), 'https://github.com/adrianlee44/lorax');
});

test('set', (t) => {
  const configObj = new Config();
  configObj.set('issue', '/issues/test/%s');
  t.is(configObj.get('issue'), '/issues/test/%s');
});

test('set object', (t) => {
  const configObj = new Config();
  configObj.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });
  t.is(configObj.get('issue'), '/issues/test/%s');
  t.is(configObj.get('commit'), '/commit/test/%s');
});

test('custom property', (t) => {
  const configObj = new Config();
  t.truthy(configObj.custom);
});

test('custom property false', (t) => {
  const configObj = new Config('random.json');
  t.is(configObj.custom, false);
});

test('write back to config', async (t) => {
  const configObj = new Config();
  configObj.set({
    issue: '/issues/test/%s',
    commit: '/commit/test/%s',
  });

  configObj.updatePath('test-config.json');
  configObj.write();

  const data = await readFile('test-config.json');
  t.truthy(data);

  await unlink('test-config.json');
});

test('reset', (t) => {
  const configObj = new Config();

  configObj.set('url', 'https://github.com/');
  t.not(configObj.get('url'), 'https://github.com/adrianlee44/lorax');

  configObj.reset();

  t.is(configObj.get('url'), 'https://github.com/adrianlee44/lorax');
});
