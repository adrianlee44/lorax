'use strict';

const test = require('ava');
const {Config} = require('../build/lib/config');
const {Parser} = require('../build/lib/parser');

const commit =
  '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123';

const parser = new Parser();

test('hash parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.hash, '7e7ac8957953e1686113f8086dc5b67246e5d3fa');
});

test('type parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.type, 'feature');
});

test('component parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.component, 'lorax');
});

test('parsing component with whitespace', (t) => {
  const configObj = new Config();
  const commitWithWhitespace =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature (lorax): Basic testing\n\nFixes #123';
  const obj = parser.parse(commitWithWhitespace, configObj);
  t.is(obj.component, 'lorax');
});

test('component special character parse', (t) => {
  const configObj = new Config();
  const specialCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax-test!): Basic testing';
  const obj = parser.parse(specialCommit, configObj);
  t.is(obj.component, 'lorax-test!');
});

test('message parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.message, 'Basic testing');
});

test('parsing message without :', (t) => {
  const configObj = new Config();
  const commitWithoutColon =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax-test) Basic testing';
  const obj = parser.parse(commitWithoutColon, configObj);
  t.is(obj.message, 'Basic testing');
});

test('title parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.title, 'feature(lorax): Basic testing');
});

test('issue parse', (t) => {
  const configObj = new Config();
  const obj = parser.parse(commit, configObj);
  t.is(obj.issues[0], 123);
});

test('issues parse', (t) => {
  const configObj = new Config();
  const issuesCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123\nFixes #124';
  const obj = parser.parse(issuesCommit, configObj);
  t.is(obj.issues[0], 123);
  t.is(obj.issues[1], 124);
});

test('breaking change parse', (t) => {
  const configObj = new Config();
  const breakingCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nBREAKING CHANGE: Testing';
  const obj = parser.parse(breakingCommit, configObj);
  t.is(obj.type, 'breaking');
  t.is(obj.message, ' Testing');
});

test('long message parse', (t) => {
  const configObj = new Config();
  let longMessage;
  longMessage =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n';
  longMessage += 'Additional features:\n';
  longMessage += '-foo\n';
  longMessage += '-bar';

  const obj = parser.parse(longMessage, configObj);
  t.is(obj.message, 'Basic testing\nAdditional features:\n-foo\n-bar');
});

test('code example in commit parse', (t) => {
  const configObj = new Config();
  let codeMessage =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n';
  codeMessage += 'Example:\n';
  codeMessage += '```\n';
  codeMessage += "var test='hello';\n";
  codeMessage += "test = test.replace('ll', 'r');\n";
  codeMessage += 'console.log(test);\n';
  codeMessage += '```\n';

  const obj = parser.parse(codeMessage, configObj);
  t.is(
    obj.message,
    "Basic testing\nExample:\n```\nvar test='hello';\ntest = test.replace('ll', 'r');\nconsole.log(test);\n```" // messages will get trimmed, hence \n at end is gone!
  );
});
