Q     = require "q"
child = require "child_process"
util  = require "util"

GIT_LOG     = "git log --grep='%s' -E --format=%s %s..HEAD"
GIT_LOG_ALL = "git log --grep='%s' -E --format=%s"
GIT_TAG     = "git describe --tags --abbrev=0"

###
@name getLastTag
@description
Get the lastest tag
@returns {Promise} A promise with tag string
###
getLastTag = ->
  deferred = Q.defer()

  child.exec GIT_TAG, (error, stdout, stderr) ->
    if error?
      deferred.reject error
    else
      deferred.resolve stdout.replace("\n", "")

  return deferred.promise

###
@name getLog
@description
Read all commits watching match pattern since a certain tag
@param {String} match String regex to match
@param {String} tag   Tag to read commits from
@returns {Promise}    A promise with an array of commits
###
getLog = (match, tag) ->
  deferred = Q.defer()

  cmd =
    if tag
      util.format(GIT_LOG, match, "%H%n%s%n%b%n==END==", tag)
    else
      util.format GIT_LOG_ALL, match, "%H%n%s%n%b%n==END=="

  child.exec cmd, (error, stdout = "", stderr) ->
    if error?
      deferred.reject error
    else
      commits = (commit for commit in stdout.split("\n==END==\n"))
      deferred.resolve commits

  return deferred.promise

module.exports = {
  getLastTag
  getLog
}