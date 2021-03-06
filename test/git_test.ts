import {getLastTag, getLog} from '../src/lib/git';
const child = require('child_process');

import test from 'ava';

test('get the last tag', (t) => {
  return getLastTag().then((result) => {
    t.truthy(result);
  });
});

test.serial('reject the promise when failed to get last tag', (t) => {
  let tmpExec = child.exec;

  // @ts-ignore
  child.exec = function (cmd, opt, fn) {
    fn('failed', 'some stdout lines');
  };

  return getLastTag()
    .then(() => {
      t.fail('Should not have succeeded');
    })
    .catch((error) => {
      t.is(error, 'failed');
    })
    .finally(() => {
      // @ts-ignore
      child.exec = tmpExec;
    });
});

test('get all repo log', (t) => {
  return getLog({grep: '^fix|^refactor'}).then((result) => {
    t.truthy(result.length);
  });
});

test('rejects the promise given invalid tag', (t) => {
  return getLog({grep: '^fix|^refactor', tag: 'doesNotExist'})
    .then(() => {
      t.fail('Should not have succeeded');
    })
    .catch((error) => {
      t.truthy(error.message.includes('Command failed:'));
    });
});

test('get no commit', (t) => {
  return getLog({grep: '^doesNotExist'}).then((result) => {
    t.is(result.length, 0);
  });
});

test.serial('reject the promise when the command fails', (t) => {
  let tmpExec = child.exec;

  // @ts-ignore
  child.exec = function (cmd, opt, fn) {
    fn('failed');
  };

  return getLog({
    grep: '^doesNotExist',
  })
    .then(() => {
      t.fail('Should not have succeeded');
    })
    .catch((error) => {
      t.is(error, 'failed');
    })
    .finally(() => {
      // @ts-ignore
      child.exec = tmpExec;
    });
});
