import Lorax from '../src/lorax.js';
import fs from 'node:fs/promises';
import {$} from 'execa';

import anyTest, {TestFn} from 'ava';

const test = anyTest as unknown as TestFn<{lorax: Lorax}>;

let secondTag: string;

test.before(async (t) => {
  t.context.lorax = new Lorax();
  const {stdout} =
    await $`git for-each-ref refs/tags --sort=-creatordate --format='%(refname:short)' --count=2`;
  secondTag = stdout.split('\n')[1];
});

test.afterEach(async () => {
  try {
    await fs.access('test.md');
    await fs.unlink('test.md');
  } catch (_) {
    // do nothing
  }
});

test('get logs', async (t) => {
  const log = await t.context.lorax.get('^fix|^feat(ure)?|^refactor|BREAKING');
  t.truthy(log);
});

test('get logs since a certain tag', async (t) => {
  const grepString = '^fix|^feat(ure)?|^refactor|BREAKING';
  const grepRegex = new RegExp(grepString, 'm');

  const data = await t.context.lorax.get(grepString, secondTag);
  t.plan(data.length - 1);

  data.forEach((commit) => {
    if (!commit) return;
    t.truthy(grepRegex.test(commit));
  });
});

test('should write to file', async (t) => {
  await t.context.lorax.generate('vtest', 'test.md', {since: secondTag});
  const data = await fs.readFile('test.md');
  t.truthy(data);
});

test('should prepend to file', async (t) => {
  const testFile = 'test/prepend_test.md';
  const originalData = await fs.readFile(testFile);
  await t.context.lorax.generate('vtest', testFile, {
    since: secondTag,
    prepend: true,
  });

  const data = await fs.readFile(testFile);
  t.truthy(data.indexOf('existing data') > -1);
  t.truthy(data.indexOf('vtest') > -1);

  await fs.writeFile(testFile, originalData, {
    encoding: 'utf-8',
  });
});
