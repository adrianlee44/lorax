'use strict';

import test from 'ava';
const Config = require('../lib/config');

test('default', t => {
  const configObj = new Config("random.json");
  t.is(configObj.config.type.length, 4);
  t.is(configObj.config.url);
});

test('loadLoraxJsonTest', t => {
  const configObj = new Config();
  t.is(configObj.config.url, "https://github.com/adrianlee44/lorax");
});

test('getFunctionTest', t => {
  const configObj = new Config();
  t.is(configObj.get("url"), "https://github.com/adrianlee44/lorax");
});

test('setFunctionTest', t => {
  const configObj = new Config();
  configObj.set("issue", "/issues/test/%s");
  t.is(configObj.get("issue"), "/issues/test/%s");
});

test('customPropertyTest', t => {
  const configObj = new Config();
  t.ok(configObj.custom);
});

test('customPropertyFalseTest', t => {
  const configObj = new Config("random.json");
  t.is(configObj.custom, false);
});

test('resetTest', t => {
  const configObj = new Config();

  configObj.set("url", "https://github.com/");
  t.not(configObj.get("url"), "https://github.com/adrianlee44/lorax");

  configObj.reset();

  t.is(configObj.get("url"), "https://github.com/adrianlee44/lorax");
});
