import Lorax from '../src/lorax';
import fs from 'node:fs/promises';
import {$} from 'execa';

let lorax: Lorax;
let secondTag: string;

beforeAll(async () => {
  lorax = new Lorax();
  const {stdout} =
    await $`git for-each-ref refs/tags --sort=-creatordate --format='%(refname:short)' --count=2`;
  secondTag = stdout.split('\n')[1];
});

afterEach(async () => {
  try {
    await fs.access('test.md');
    await fs.unlink('test.md');
  } catch (_) {
    // do nothing
  }
});

test('get logs', async () => {
  const log = await lorax.get('^fix|^feat(ure)?|^refactor|BREAKING');
  expect(log).toBeTruthy();
});

test('get logs since a certain tag', async () => {
  const grepString = '^fix|^feat(ure)?|^refactor|BREAKING';
  const grepRegex = new RegExp(grepString, 'm');

  const data = await lorax.get(grepString, secondTag);
  expect.assertions(data.length - 1);

  data.forEach((commit) => {
    if (!commit) return;
    expect(grepRegex.test(commit)).toBeTruthy();
  });
});

test('should write to file', async () => {
  await lorax.generate('vtest', 'test.md', {since: secondTag});
  const data = await fs.readFile('test.md');
  expect(data).toBeTruthy();
});

test('should prepend to file', async () => {
  const testFile = 'test/prepend_test.md';
  const originalData = await fs.readFile(testFile);
  await lorax.generate('vtest', testFile, {
    since: secondTag,
    prepend: true,
  });

  const data = await fs.readFile(testFile);
  expect(data.indexOf('existing data') > -1).toBeTruthy();
  expect(data.indexOf('vtest') > -1).toBeTruthy();

  await fs.writeFile(testFile, originalData, {
    encoding: 'utf-8',
  });
});
