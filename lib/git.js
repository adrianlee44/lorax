var GIT_LOG, GIT_LOG_ALL, GIT_TAG, Q, child, getLastTag, getLog, util, GIT_LOG_FORMAT;

Q = require("q");
child = require("child_process");
util = require("util");
GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";
GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";
GIT_TAG = "git describe --tags --abbrev=0";
GIT_LOG_FORMAT = "%H%n%s%n%b%n==END==";

/**
 * @name getLastTag
 * @description
 * Get the lastest tag
 * @returns {Promise} A promise with tag string
 */

getLastTag = function() {
  var deferred;
  deferred = Q.defer();
  child.exec(GIT_TAG, function(error, stdout, stderr) {
    if (error) {
      deferred.resolve(null, error);
    } else {
      deferred.resolve(stdout.replace("\n", ""));
    }
  });
  return deferred.promise;
};

/**
 * @name getLog
 * @description
 * Read all commits watching match pattern since a certain tag
 * @param {String} match String regex to match
 * @param {String} tag   Tag to read commits from
 * @returns {Promise}    A promise with an array of commits
 */

getLog = function(match, tag) {
  var cmd, deferred;
  deferred = Q.defer();
  cmd = tag ? util.format(GIT_LOG, match, GIT_LOG_FORMAT, tag) : util.format(GIT_LOG_ALL, match, GIT_LOG_FORMAT);
  child.exec(cmd, function(error, stdout, stderr) {
    var commits;
    if (stdout === undefined) {
      stdout = "";
    }
    if (error) {
      deferred.reject(null, error);
    } else {
      commits = stdout.split("\n==END==\n");
      deferred.resolve(commits);
    }
  });
  return deferred.promise;
};

module.exports = {
  getLastTag: getLastTag,
  getLog: getLog
};
