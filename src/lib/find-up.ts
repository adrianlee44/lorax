/**
 * @name find-up
 * @description
 * Look for a file in the current directory and each of its parents
 */

import {statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

const NOT_FOUND_CODES = new Set(['ENOENT', 'ENOTDIR']);

function exists(path: string): boolean {
  try {
    statSync(path);
    return true;
  } catch (error) {
    const {code} = error as {code?: string};
    if (code && NOT_FOUND_CODES.has(code)) return false;
    throw error;
  }
}

/**
 * @description
 * Walk up from a directory and return the absolute path of the first match
 * of name, or null if none is found. Only a missing file moves the search to
 * the parent directory; any other error (e.g. permission denied) is thrown.
 */
export function findUp(name: string, from = process.cwd()): string | null {
  let dir: string | null = resolve(from);

  while (dir) {
    const candidate = join(dir, name);
    if (exists(candidate)) return candidate;

    const parent = dirname(dir);
    dir = parent === dir ? null : parent;
  }

  return null;
}
