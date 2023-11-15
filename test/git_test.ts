import {getLastTag, getLog} from '../src/lib/git.js';

import test from 'ava';

test('get the last tag', async (t) => {
  const result = await getLastTag();
  t.truthy(result);
});

test('get all repo log', async (t) => {
  const result = await getLog({grep: '^fix|^refactor'});
  t.truthy(result.length);
});

test('rejects the promise given invalid tag', async (t) => {
  const error = await t.throwsAsync(
    getLog({grep: '^fix|^refactor', tag: 'doesNotExist'})
  );
  t.truthy(error?.message.includes('Command failed'));
});

test('get no commit', async (t) => {
  const result = await getLog({grep: '^doesNotExist'});
  t.is(result.length, 0);
});
