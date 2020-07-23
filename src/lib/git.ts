'use strict';

/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

import * as util from 'util';
import {exec, ExecException} from 'child_process';

const GIT_LOG = "git log -E --format=%s HEAD '^%s'";
const GIT_LOG_ALL = "git log -E --format=%s";
const GIT_TAG = 'git tag --list --merged HEAD --sort "-committerdate"';
const GIT_LOG_FORMAT = '%H%n%B%n==END==';

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
function getLastTag(): Promise<Nullable<string>> {
  return new Promise<string>((resolve, reject) => {
    exec(GIT_TAG, {}, (error: Nullable<ExecException>, stdout: string) => {
      if (error) return reject(error);

      resolve(stdout);
    });
  })
    .then((stdout: string): string => {
      const lst = stdout.split('\n').map((l) => l.trim()).filter((l, i) => l.length > 0);
      // GIT_TAG sorts tags from most recent to oldest, 
      // hence top entry will be the 'last' tag == most recent tag.
      const last = lst[0] || '';
      return last;
    })
    .catch(() => null);
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
function getLog(tag: Nullable<string>): Promise<Array<string>> {
  const cmd = tag
    ? util.format(GIT_LOG, GIT_LOG_FORMAT, tag)
    : util.format(GIT_LOG_ALL, GIT_LOG_FORMAT);
  console.error('@@@ GIT command: ', { cmd, tag });

  return new Promise<Array<string>>((resolve, reject) => {
    exec(cmd, {}, (error: Nullable<ExecException>, stdout = '') => {
      if (error) {
        reject(new Error(`failed to obtain git log output.\n\ncommandline:\n    ${cmd}\n\nResult: ${error.message}`));
      } else {
        let output: Array<string> = stdout ? stdout.split('\n==END==\n') : [];

        resolve(output);
      }
    });
  });
}

export {getLastTag, getLog};
