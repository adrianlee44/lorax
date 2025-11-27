import Printer from '../src/lib/printer.js';
import Config from '../src/lib/config.js';

let config: Config;
let printer: Printer;

beforeEach(() => {
  config = new Config();
  printer = new Printer([], 'v0.1.0', config);
});

test('basicTest', () => {
  const output = printer.linkToCommit('1a91039');
  expect(output).toBe(
    '[1a91039](https://github.com/adrianlee44/lorax/commit/1a91039)'
  );
});

test('noUrlTest', () => {
  config.set('url', '');

  const output = printer.linkToCommit('1a91031a9849');
  expect(output).toBe('1a91031a');
});

test('noCommitTemplateTest', () => {
  config.set('commit', '');

  const output = printer.linkToCommit('1a91031a9849');
  expect(output).toBe('1a91031a');
});

test('noCommitTest', () => {
  const output = printer.linkToCommit();
  expect(output).toBe('');
});
