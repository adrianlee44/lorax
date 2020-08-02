'use strict';

/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

import * as util from 'util';
import {exec, ExecException} from 'child_process';

const GIT_LOG = 'git log';
const GIT_LOG_GREP_OPTION = "--grep='%s' -E";
const GIT_LOG_TAG_OPTION = '%s..HEAD';
const GIT_LOG_LINE_SEPARATOR = '==END==';
const GIT_LOG_FORMAT = `%H%n%s%n%b%n${GIT_LOG_LINE_SEPARATOR}`;
const GIT_LOG_FORMAT_OPTION = '--format=%s';
const GIT_TAG = 'git describe --tags --abbrev=0';

interface GetLogOptions {
  grep?: string;
  tag?: string;
}

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
function getLog(options = {} as GetLogOptions): Promise<Array<string>> {
  const {grep, tag} = options;
  const cmdArgs = [util.format(GIT_LOG_FORMAT_OPTION, GIT_LOG_FORMAT)];

  if (grep) {
    cmdArgs.push(util.format(GIT_LOG_GREP_OPTION, grep));
  }

  if (tag) {
    cmdArgs.push(util.format(GIT_LOG_TAG_OPTION, tag));
  }

  const cmd = `${GIT_LOG} ${cmdArgs.join(' ')}`;

  return new Promise<Array<string>>((resolve, reject) => {
    exec(cmd, {}, (error: Nullable<ExecException>, stdout = '') => {
      let output: Array<string> = [];
      if (error) {
        reject(error);
      } else {
        output = stdout ? stdout.split(`\n${GIT_LOG_LINE_SEPARATOR}\n`) : [];
      }

      resolve(output);
    });
  });
}

export {getLastTag, getLog};
