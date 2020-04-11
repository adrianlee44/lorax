const test = require('ava');
const {getLastTag, getLog} = require('../build/lib/git');
let child = require('child_process');

test('get the last tag', t => {
  return getLastTag()
  .then(result => {
    t.truthy(result);
  });
});

test.serial('failed to get last tag', t => {
  let tmpExec = child.exec;

  child.exec = function (cmd, opt, fn) {
    fn('failed', 'some stdout lines');
  };

  return getLastTag()
  .then((result) => {
    t.truthy(!result);
    child.exec = tmpExec;
  });
});

test('get all repo log', t => {
  return getLog('^fix|^refactor')
  .then(result => {
    t.truthy(result.length);
  });
});

test('return empty array when given invalid tag', t => {
  return getLog('^fix|^refactor', 'doesNotExist')
  .then((result) => {
    t.is(result.length, 0);
  });
});

test('get no commit', t => {
  return getLog('^doesNotExist')
  .then(result => {
    t.is(result.length, 0);
  });
});
