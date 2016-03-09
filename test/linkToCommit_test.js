'use strict';

import test from 'ava';
import Printer from '../lib/printer';
import Config from '../lib/config';

test.beforeEach(t => {
  t.context.config = new Config();
  t.context.printer = new Printer([], 'v0.1.0', t.context.config);
});

test.afterEach(t => {
  t.context = {};
});

test('basicTest', t => {
  const output = t.context.printer.linkToCommit('1a91039');
  t.is(output, '[1a91039](https://github.com/adrianlee44/lorax/commit/1a91039)');
});

test('noUrlTest', t => {
  t.context.config.set('url', '');

  const output = t.context.printer.linkToCommit('1a91031a9849');
  t.is(output, '1a91031a');
});

test('noCommitTemplateTest', t => {
  t.context.config.set('commit', '');

  const output = t.context.printer.linkToCommit('1a91031a9849');
  t.is(output, '1a91031a');
});

test('noCommitTest', t => {
  const output = t.context.printer.linkToCommit();
  t.is(output, '');
});
