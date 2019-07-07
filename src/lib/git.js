// @flow

/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

'use strict';

import * as util from 'util';
const Promise = require('bluebird');

const GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";
const GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";
const GIT_TAG = "git describe --tags --abbrev=0";
const GIT_LOG_FORMAT = "%H%n%s%n%b%n==END==";

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
function getLastTag(): Promise<?string> {
  const execAsync = Promise.promisify(require('child_process').exec);
  return execAsync(GIT_TAG)
    .then((stdout: string): string => {
      return stdout.replace("\n", "");
    })
    .error(() => null);
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
function getLog(match: string, tag: ?string): Promise<Array<string>> {
  const cmd = tag ? util.format(GIT_LOG, match, GIT_LOG_FORMAT, tag) : util.format(GIT_LOG_ALL, match, GIT_LOG_FORMAT);

  const execAsync = Promise.promisify(require('child_process').exec);
  return execAsync(cmd)
    .then((stdout: ?string): Array<string> => {
      stdout = stdout || '';
      return stdout ? stdout.split("\n==END==\n") : [];
    })
    .error((): Array<string> => []);
}

module.exports = {getLastTag, getLog};
