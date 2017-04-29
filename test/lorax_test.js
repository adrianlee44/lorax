'use strict';

import test from 'ava';
import lorax from '../src/lorax';
import * as fs from 'fs';
import * as child from 'child_process';

let secondTag;

test.before.cb(t => {
  const last2Tags = 'git for-each-ref refs/tags --sort=-creatordate --format=\'%(refname:short)\' --count=2';
  child.exec(last2Tags, (error, stdout) => {
    secondTag = stdout.split('\n')[1];
    t.end();
  });
});

test.afterEach.cb(t => {
  fs.access('test.md', (err) => {
    if (err) {
      t.end();
    } else {
      fs.unlink('test.md', t.end);
    }
  });
});

test.serial('get logs', t => {
  return lorax.get("^fix|^feature|^refactor|BREAKING")
  .then((log) => {
    t.truthy(log);
  });
});

test.serial('get logs since a certain tag', t => {
  const grepString = '^fix|^feature|^refactor|BREAKING';
  const grepRegex = new RegExp(grepString);

  return lorax.get(grepString, secondTag)
  .then((data) => {
    t.plan(data.length - 1);

    data.forEach((commit) => {
      if (!commit) return;

      const lines = commit.split('\n');
      t.truthy(grepRegex.test(lines[1]));
    });
  });
});

test.cb('should write to file', t => {
  lorax.generate('vtest', 'test.md', {since: secondTag})
  .then(() => {
    fs.readFile('test.md', t.end);
  });
});

test.cb('should prepend to file', t => {
  let testFile = 'test/prepend_test.md';
  let originalData = fs.readFileSync(testFile);
  lorax.generate('vtest', testFile, {since: secondTag, prepend: true})
  .then(() => {
    let data = fs.readFileSync(testFile);

    t.truthy(data.indexOf('existing data') > -1);
    t.truthy(data.indexOf('vtest') > -1);

    fs.writeFileSync(testFile, originalData, {
      'encoding': 'utf-8'
    });

    t.end();
  });
});
