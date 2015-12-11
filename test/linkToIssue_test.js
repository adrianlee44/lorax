import test from 'ava';

const lorax = require('../index');
const linkToIssue = lorax.linkToIssue;

test.afterEach(() => {
  lorax.config.reset();
});

test('basicTest', t => {
  const output = linkToIssue('123');
  t.is(output, '[#123](https://github.com/adrianlee44/lorax/issues/123)');
});

test('noUrlTest', t => {
  lorax.config.set('url', '');

  const output = linkToIssue('123');
  t.is(output, '#123');
});

test('noIssueTemplateTest', t => {
  lorax.config.set('issue', '');

  const output = linkToIssue('123');
  t.is(output, '#123');
});

test('noIssueTest', t => {
  const output = linkToIssue();
  t.is(output, '');
});
