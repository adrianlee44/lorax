const test = require('ava');
const {getLastTag, getLog} = require('../build/lib/git');
let child = require('child_process');

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
    .then(() => {
      t.fail('Should not have succeeded');
    })
    .catch((error) => {
      t.is(error, 'failed');
    })
    .finally(() => {
      child.exec = tmpExec;
    });
});

test('get all repo log', (t) => {
  return getLog({grep: '^fix|^refactor'}).then((result) => {
    t.truthy(result.length);
  });
});

test('return empty array when given invalid tag', (t) => {
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

test.serial('has no stdout', (t) => {
  let tmpExec = child.exec;

  child.exec = function (cmd, opt, fn) {
    fn('failed');
  };

  return getLog({grep: '^doesNotExist'})
    .then(() => {
      t.fail('Should not have succeeded');
    })
    .catch((error) => {
      t.is(error, 'failed');
    })
    .finally(() => {
      child.exec = tmpExec;
    });
});
