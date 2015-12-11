import test from 'ava';

const lorax = require('../index');
const linkToCommit = lorax.linkToCommit;

test.afterEach(() => {
  lorax.config.reset();
});

test('basicTest', t => {
  const output = linkToCommit('1a91039');
  t.is(output, '[1a91039](https://github.com/adrianlee44/lorax/commit/1a91039)');
});

test('noUrlTest', t => {
  lorax.config.set('url', '');

  const output = linkToCommit('1a91031a9849');
  t.is(output, '1a91031a');
});

test('noCommitTemplateTest', t => {
  lorax.config.set('commit', '');

  const output = linkToCommit('1a91031a9849');
  t.is(output, '1a91031a');
});

test('noCommitTest', t => {
  const output = linkToCommit();
  t.is(output, '');
});
