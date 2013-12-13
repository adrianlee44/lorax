var GIT_LOG, GIT_LOG_ALL, GIT_TAG, Q, child, getLastTag, getLog, util;

Q = require("q");

child = require("child_process");

util = require("util");

GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD";

GIT_LOG_ALL = "git log --grep='%s' -E --format=%s";

GIT_TAG = "git describe --tags --abbrev=0";

/*
@name getLastTag
@description
Get the lastest tag
@returns {Promise} A promise with tag string
*/


getLastTag = function() {
  var deferred;
  deferred = Q.defer();
  child.exec(GIT_TAG, function(error, stdout, stderr) {
    if (error != null) {
      return deferred.reject(error);
    } else {
      return deferred.resolve(stdout.replace("\n", ""));
    }
  });
  return deferred.promise;
};

/*
@name getLog
@description
Read all commits watching match pattern since a certain tag
@param {String} match String regex to match
@param {String} tag   Tag to read commits from
@returns {Promise}    A promise with an array of commits
*/


getLog = function(match, tag) {
  var cmd, deferred;
  deferred = Q.defer();
  cmd = tag ? util.format(GIT_LOG, match, "%H%n%s%n%b%n==END==", tag) : util.format(GIT_LOG_ALL, match, "%H%n%s%n%b%n==END==");
  child.exec(cmd, function(error, stdout, stderr) {
    var commit, commits;
    if (stdout == null) {
      stdout = "";
    }
    if (error != null) {
      return deferred.reject(error);
    } else {
      commits = (function() {
        var _i, _len, _ref, _results;
        _ref = stdout.split("\n==END==\n");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          commit = _ref[_i];
          _results.push(commit);
        }
        return _results;
      })();
      return deferred.resolve(commits);
    }
  });
  return deferred.promise;
};

module.exports = {
  getLastTag: getLastTag,
  getLog: getLog
};
