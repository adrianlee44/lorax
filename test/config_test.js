'use strict';

import test from 'ava';
import * as fs from 'fs';
const Config = require('../lib/config');

test.afterEach.cb(t => {
  fs.access('test-config.json', (err) => {
    if (err) {
      t.end()
    } else {
      fs.unlink('test-config.json', t.end);
    }
  });
});

test('default', t => {
  const configObj = new Config("random.json");
  t.is(configObj.config.type.length, 4);
  t.is(configObj.config.url);
});

test('invalid file', t => {
  const configObj = new Config("/null");
  t.same(configObj.jsonData, undefined);
});

test('load lorax json', t => {
  const configObj = new Config();
  t.is(configObj.config.url, "https://github.com/adrianlee44/lorax");
});

test('get', t => {
  const configObj = new Config();
  t.is(configObj.get("url"), "https://github.com/adrianlee44/lorax");
});

test('set', t => {
  const configObj = new Config();
  configObj.set("issue", "/issues/test/%s");
  t.is(configObj.get("issue"), "/issues/test/%s");
});

test('set object', t => {
  const configObj = new Config();
  configObj.set({
    'issue': '/issues/test/%s',
    'commit': '/commit/test/%s'
  });
  t.is(configObj.get("issue"), "/issues/test/%s");
  t.is(configObj.get("commit"), "/commit/test/%s");
});

test('custom property', t => {
  const configObj = new Config();
  t.ok(configObj.custom);
});

test('custom property false', t => {
  const configObj = new Config("random.json");
  t.is(configObj.custom, false);
});

test.cb('write back to config', t => {
  const configObj = new Config();
  configObj.set({
    'issue': '/issues/test/%s',
    'commit': '/commit/test/%s'
  });

  configObj.path = 'test-config.json';

  configObj.write();
  fs.readFile('test-config.json', t.end);
});

test('reset', t => {
  const configObj = new Config();

  configObj.set("url", "https://github.com/");
  t.not(configObj.get("url"), "https://github.com/adrianlee44/lorax");

  configObj.reset();

  t.is(configObj.get("url"), "https://github.com/adrianlee44/lorax");
});
