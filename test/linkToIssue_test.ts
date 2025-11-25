import Printer from '../src/lib/printer.js';
import Config from '../src/lib/config.js';

import anyTest, {TestFn} from 'ava';

const test = anyTest as unknown as TestFn<{config: Config; printer: Printer}>;

test.beforeEach((t) => {
  t.context.config = new Config();
  t.context.printer = new Printer([], 'v0.1.0', t.context.config);
});

test('basicTest', (t) => {
  const output = t.context.printer.linkToIssue(123);
  t.is(output, '[#123](https://github.com/adrianlee44/lorax/issues/123)');
});

test('noUrlTest', (t) => {
  t.context.config.set('url', '');

  const output = t.context.printer.linkToIssue(123);
  t.is(output, '#123');
});

test('noIssueTemplateTest', (t) => {
  t.context.config.set('issue', '');

  const output = t.context.printer.linkToIssue(123);
  t.is(output, '#123');
});

test('noIssueTest', (t) => {
  const output = t.context.printer.linkToIssue();
  t.is(output, '');
});
