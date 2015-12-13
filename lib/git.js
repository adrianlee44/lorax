/**
 * @name git
 * @description
 * Utility functions for interacting with git
 */

'use strict';

const Q = require("q");
const child = require("child_process");
const util = require("util");
const GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";
const GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";
const GIT_TAG = "git describe --tags --abbrev=0";
const GIT_LOG_FORMAT = "%H%n%s%n%b%n==END==";

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 * @returns {Promise} A promise with tag string
 */
function getLastTag() {
  const deferred = Q.defer();
  child.exec(GIT_TAG, function(error, stdout) {
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
 * @param {String} match String regex to match
 * @param {String} tag   Tag to read commits from
 * @returns {Promise}    A promise with an array of commits
 */
function getLog(match, tag) {
  const deferred = Q.defer();
  const cmd = tag ? util.format(GIT_LOG, match, GIT_LOG_FORMAT, tag) : util.format(GIT_LOG_ALL, match, GIT_LOG_FORMAT);

  child.exec(cmd, function(error, stdout) {
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

module.exports = {
  getLastTag: getLastTag,
  getLog: getLog
};
