const test = require('ava');
const {getLastTag, getLog} = require('../build/lib/git');
let child = require('child_process');

/* eslint no-unused-vars: 0 */

test('get the last tag', (t) => {
  return getLastTag().then((result) => {
    t.truthy(result);
  });
});

test.serial('failed to get last tag', (t) => {
  let tmpExec = child.exec;

  child.exec = function (cmd, opt, fn) {
    fn('failed', 'some stdout lines');
  };

  return getLastTag()
    .then((result) => {
      t.truthy(!'should never get here');
      child.exec = tmpExec;
    })
    .catch((error) => {
      t.is(error, 'failed');
      child.exec = tmpExec;
    });
});

test('get all repo log', (t) => {
  return getLog().then((result) => {
    t.truthy(result.length);
  });
});

test('get log from tag onwards', (t) => {
  return getLog('v2.0.0').then((result) => {
    t.truthy(result.length);
  });
});

test('get log between two tags', (t) => {
  return getLog('v1.1.0', 'v2.0.0').then((result) => {
    t.is(result.length, 27);
  });
});

test('get log from start until tag', (t) => {
  return getLog(null, 'v2.0.0').then((result) => {
    t.is(result.length, 112);
  });
});

test('return empty array when given invalid tag', (t) => {
  return getLog('doesNotExist')
    .then((result) => {
      t.is(result.length, 0);
      t.truthy(!'should never get here');
    })
    .catch((error) => {
      t.truthy(error.message.includes('failed to obtain git log output'));
    });
});

test('get no commit', (t) => {
  return getLog('^doesNotExist')
    .then((result) => {
      t.is(result.length, 0);
      t.truthy(!'should never get here');
    })
    .catch((error) => {
      t.truthy(error.message.includes('failed to obtain git log output'));
    });
});

test.serial('has no stdout', (t) => {
  let tmpExec = child.exec;

  child.exec = function (cmd, opt, fn) {
    fn('failed');
  };

  return getLog('^doesNotExist')
    .then((result) => {
      t.is(result.length, 0);
      t.truthy(!'should never get here');
      child.exec = tmpExec;
    })
    .catch((error) => {
      t.truthy(error.message.includes('failed to obtain git log output'));
      child.exec = tmpExec;
    });
});
