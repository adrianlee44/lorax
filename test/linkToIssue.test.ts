import Printer from '../src/lib/printer';
import Config from '../src/lib/config';

let config: Config;
let printer: Printer;

beforeEach(() => {
  config = new Config();
  printer = new Printer([], 'v0.1.0', config);
});

test('basicTest', () => {
  const output = printer.linkToIssue(123);
  expect(output).toBe(
    '[#123](https://github.com/adrianlee44/lorax/issues/123)'
  );
});

test('noUrlTest', () => {
  config.set('url', '');

  const output = printer.linkToIssue(123);
  expect(output).toBe('#123');
});

test('noIssueTemplateTest', () => {
  config.set('issue', '');

  const output = printer.linkToIssue(123);
  expect(output).toBe('#123');
});

test('noIssueTest', () => {
  const output = printer.linkToIssue();
  expect(output).toBe('');
});
