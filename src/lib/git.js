// @flow

/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

'use strict';

import * as Q from 'q';
import {exec} from 'child_process';
import * as util from 'util';

const GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";
const GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";
const GIT_TAG = "git describe --tags --abbrev=0";
const GIT_LOG_FORMAT = "%H%n%s%n%b%n==END==";

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 */
function getLastTag(): Promise<string> {
  const deferred = Q.defer();
  exec(GIT_TAG, function(error, stdout) {
    if (error) {
      deferred.resolve(null, error);
    } else {
      deferred.resolve(stdout.replace("\n", ""));
    }
  });

  return deferred.promise;
}

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 */
function getLog(match: string, tag: string): Promise<Array<string>> {
  const deferred = Q.defer();
  const cmd = tag ? util.format(GIT_LOG, match, GIT_LOG_FORMAT, tag) : util.format(GIT_LOG_ALL, match, GIT_LOG_FORMAT);

  exec(cmd, function(error, stdout) {
    stdout = stdout || '';

    if (error) {
      deferred.reject(null, error);
    } else {
      const commits = stdout ? stdout.split("\n==END==\n") : [];
      deferred.resolve(commits);
    }
  });
  return deferred.promise;
}

module.exports = {getLastTag, getLog};
