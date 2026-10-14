/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);

const GIT_LOG_LINE_SEPARATOR = '==END==';
const GIT_LOG_FORMAT = `%H%n%s%n%b%n${GIT_LOG_LINE_SEPARATOR}`;
const MAX_BUFFER = 1024 * 1024 * 100;

interface GetLogOptions {
  grep?: string;
  tag?: string;
}

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
export async function getLastTag(): Promise<string> {
  const {stdout} = await execFileAsync('git', [
    'describe',
    '--tags',
    '--abbrev=0',
  ]);
  return stdout.trim();
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
export async function getLog(
  options = {} as GetLogOptions
): Promise<Array<string>> {
  const {grep, tag} = options;
  const cmdArgs = ['log', `--format=${GIT_LOG_FORMAT}`];

  if (grep) {
    cmdArgs.push(`--grep=${grep}`, '-E');
  }

  if (tag) {
    // A leading dash would be parsed by git as an option
    if (tag.startsWith('-')) {
      throw new Error(`Invalid tag: ${tag}`);
    }
    cmdArgs.push(`${tag}..HEAD`);
  }

  const {stdout} = await execFileAsync('git', cmdArgs, {
    maxBuffer: MAX_BUFFER,
  });
  return stdout ? stdout.split(`\n${GIT_LOG_LINE_SEPARATOR}\n`) : [];
}
