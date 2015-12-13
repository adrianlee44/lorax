import test from 'ava';
import {getLastTag, getLog} from '../lib/git';

test('get the last tag', t => {
  return getLastTag()
  .then(result => {
    t.ok(result);
  });
});

test('get current repo log', t => {
  return getLog('^fix|^refactor', 'v0.1.0')
  .then(result => {
    t.ok(result.length);
  });
});

test('get all repo log', t => {
  return getLog('^fix|^refactor')
  .then(result => {
    t.ok(result.length);
  });
});

test('get no commit', t => {
  return getLog('^doesNotExist')
  .then(result => {
    t.same(result.length, 0);
  });
});
