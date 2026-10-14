import {chmod, mkdir, mkdtemp, realpath, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {findUp} from '../src/lib/find-up.js';

let root: string;
let nested: string;

beforeAll(async () => {
  root = await realpath(await mkdtemp(join(tmpdir(), 'lorax-find-up-')));
  nested = join(root, 'packages', 'app', 'src');

  await mkdir(nested, {recursive: true});
  await mkdir(join(root, 'configs'));
  await writeFile(join(root, 'lorax.json'), '{}');
  await writeFile(join(root, 'configs', 'custom.json'), '{}');
});

afterAll(async () => {
  await rm(root, {recursive: true, force: true});
});

test('finds a file in the starting directory', () => {
  expect(findUp('lorax.json', root)).toBe(join(root, 'lorax.json'));
});

test('finds a file in a parent directory', () => {
  expect(findUp('lorax.json', nested)).toBe(join(root, 'lorax.json'));
});

test('finds a relative path with subdirectories', () => {
  expect(findUp('configs/custom.json', nested)).toBe(
    join(root, 'configs', 'custom.json')
  );
});

test('returns null when nothing matches', () => {
  expect(findUp('lorax-does-not-exist.json', nested)).toBeNull();
});

test('treats a path through a file as not found and keeps looking', async () => {
  await writeFile(join(nested, 'configs'), '');
  expect(findUp('configs/custom.json', nested)).toBe(
    join(root, 'configs', 'custom.json')
  );
});

const canTestPermissions =
  process.platform !== 'win32' && process.getuid?.() !== 0;

(canTestPermissions ? test : test.skip)(
  'throws instead of continuing when a directory is not accessible',
  async () => {
    const locked = join(root, 'locked');
    await mkdir(locked);
    await writeFile(join(locked, 'lorax.json'), '{}');
    await chmod(locked, 0o000);

    try {
      expect(() => findUp('lorax.json', locked)).toThrow(/EACCES/);
    } finally {
      await chmod(locked, 0o755);
    }
  }
);
