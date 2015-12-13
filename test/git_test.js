import test from 'ava';
import {getLastTag, getLog} from '../lib/git';

test('get the last tag', t => {
  return getLastTag()
  .then(result => {
    t.ok(result);
  });
});

test('get all repo log', t => {
  return getLog('^fix|^refactor')
  .then(result => {
    t.ok(result.length);
  });
});

test('fail when given invalid tag', t => {
  return getLog('^fix|^refactor', 'doesNotExist')
  .fail(result => {
    t.notOk(result);
  });
});

test('get no commit', t => {
  return getLog('^doesNotExist')
  .then(result => {
    t.same(result.length, 0);
  });
});
