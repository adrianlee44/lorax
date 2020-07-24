'use strict';

const test = require('ava');
const {Lorax} = require('../build/lorax');
const fs = require('fs');
const child = require('child_process');

let secondTag = 'v2.0.0';

test.before.cb((t) => {
  t.context.lorax = new Lorax();
  const last2Tags =
    'git for-each-ref refs/tags --sort=-creatordate "--format=%(refname:short)" --count=2';
  child.exec(last2Tags, (error, stdout) => {
    //t.log('tags:', stdout);
    //secondTag = stdout.split('\n')[1];
    t.end();
  });
});

test.afterEach.cb((t) => {
  fs.access('test.md', (err) => {
    if (err) {
      t.end();
    } else {
      fs.unlink('test.md', t.end);
    }
  });
});

test.serial('get logs', (t) => {
  return t.context.lorax.get('^fix|^feature|^refactor|BREAKING').then((log) => {
    t.truthy(log);
  });
});

test.serial('get logs since a certain tag', (t) => {
  const grepString = '^fix|^feature|^refactor|BREAKING';
  const grepRegex = new RegExp(grepString);

  return t.context.lorax.get({
    since: secondTag
  }).then((data) => {
    t.plan(1);

    let mostDoMatch = 0;
    data.forEach((commit) => {
      if (!commit) return;

      const lines = commit.split('\n');
      if (grepRegex.test(lines[1])) {
        mostDoMatch++;
      }
    });
    t.truthy(mostDoMatch >= 10);
  });
});

test.cb('should write to file', (t) => {
  t.context.lorax.generate('vtest', 'test.md', {since: secondTag}).then(() => {
    fs.readFile('test.md', t.end);
  });
});

test('should prepend to file', (t) => {
  let testFile = 'test/prepend_test.md';
  let originalData = fs.readFileSync(testFile);
  return t.context.lorax
    .generate('vtest', testFile, {since: secondTag, prepend: true})
    .then(() => {
      let data = fs.readFileSync(testFile);

      t.truthy(data.indexOf('existing data') > -1);
      t.truthy(data.indexOf('vtest') > -1);

      fs.writeFileSync(testFile, originalData, {
        encoding: 'utf-8',
      });
    });
});
