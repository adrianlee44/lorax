'use strict';

import test from 'ava';
import * as lorax from '../index';
import * as fs from 'fs';
import * as child from 'child_process';

let secondTag;

test.before.cb(t => {
  const last2Tags = 'git for-each-ref refs/tags --sort=-creatordate --format=\'%(refname:short)\' --count=2';
  child.exec(last2Tags, (error, stdout) => {
    secondTag = stdout.split('\n')[1];
    t.end()
  });
});

test.afterEach.cb(t => {
  fs.stat('test.md', (err, stats) => {
    if (stats) {
      fs.unlink('test.md', t.end);
    } else {
      t.end();
    }
  });
});

test('get logs', t => {
  return lorax.get("^fix|^feature|^refactor|BREAKING")
  .then((log) => {
    t.ok(log);
  });
});

test('get logs since a certain tag', t => {
  const grepString = '^fix|^feature|^refactor|BREAKING'
  const grepRegex = new RegExp(grepString);

  return lorax.get(grepString, secondTag)
  .then((data) => {
    t.plan(data.length - 1);

    data.forEach((commit) => {
      if (!commit) return;

      const lines = commit.split('\n');
      t.ok(grepRegex.test(lines[1]));
    });
  });
});

test.cb('should write to file', t => {
  lorax.generate('vtest', 'test.md', {since: secondTag})
  .then(() => {
    fs.readFile('test.md', t.end);
  });
});
