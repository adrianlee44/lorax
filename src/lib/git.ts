'use strict';

/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

import * as util from 'util';
import {exec, ExecException} from 'child_process';

const GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";
const GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";
const GIT_TAG = 'git describe --tags --abbrev=0';
const GIT_LOG_FORMAT = '%H%n%s%n%b%n==END==';

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
function getLastTag(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(GIT_TAG, {}, (error: Nullable<ExecException>, stdout: string) => {
      if (error) return reject(error);

      resolve(stdout);
    });
  }).then((stdout: string): string => {
    return stdout.replace('\n', '');
  });
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
function getLog(match: string, tag: Nullable<string>): Promise<Array<string>> {
  const cmd = tag
    ? util.format(GIT_LOG, match, GIT_LOG_FORMAT, tag)
    : util.format(GIT_LOG_ALL, match, GIT_LOG_FORMAT);

  return new Promise<Array<string>>((resolve, reject) => {
    exec(cmd, {}, (error: Nullable<ExecException>, stdout = '') => {
      let output: Array<string> = [];
      if (error) {
        reject(error);
      } else {
        output = stdout ? stdout.split('\n==END==\n') : [];
      }

      resolve(output);
    });
  });
}

export {getLastTag, getLog};
