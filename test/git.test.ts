import {getLastTag, getLog} from '../src/lib/git.js';

test('get the last tag', async () => {
  const result = await getLastTag();
  expect(result).toBeTruthy();
});

test('get all repo log', async () => {
  const result = await getLog({grep: '^fix|^refactor'});
  expect(result.length).toBeTruthy();
});

test('rejects the promise given invalid tag', async () => {
  await expect(
    getLog({grep: '^fix|^refactor', tag: 'doesNotExist'})
  ).rejects.toThrow(/Command failed/);
});

test('rejects tags that look like git options', async () => {
  await expect(getLog({tag: '--output=/tmp/x'})).rejects.toThrow(/Invalid tag/);
});

test('get no commit', async () => {
  const result = await getLog({grep: '^doesNotExist'});
  expect(result.length).toBe(0);
});
