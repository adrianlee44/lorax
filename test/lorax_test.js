'use strict';

import test from 'ava';
import * as lorax from '../index';
import * as fs from 'fs';

test.afterEach.cb(t => {
  fs.stat('test.md', (err, stats) => {
    if (stats) {
      fs.unlink('test.md', t.end);
    } else {
      t.end();
    }
  });
});

test('get logs', async t => {
  const log = lorax.get("^fix|^feature|^refactor|BREAKING");
  t.ok(await log);
});

test('get logs since a certain tag', async t => {
  const grepString = '^fix|^feature|^refactor|BREAKING'
  const grepRegex = new RegExp(grepString);

  const log = lorax.get(grepString, 'v0.1.3');
  const data = await log;
  t.plan(data.length - 1);

  data.forEach((commit) => {
    if (!commit) return;

    const lines = commit.split('\n');
    t.ok(grepRegex.test(lines[1]));
  });
});

test.cb('should write to file', t => {
  lorax.generate('vtest', 'test.md', {since: 'v0.1.3'})
  .then(() => {
    fs.readFile('test.md', t.end);
  });
});
