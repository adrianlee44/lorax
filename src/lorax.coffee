###
@name Lorax

@description
A node module which reads the git log and create a human readable changelog

@author Adrian Lee
@url https://github.com/adrianlee44/lorax
@license MIT

@dependencies
- commander
###

util   = require "util"
fs     = require "fs"
path   = require "path"
pkg    = require path.join(__dirname, "package.json")
config = require "./lib/config"
git    = require "./lib/git"

GIT_GREP = "" # Should be generated through option passed in

Config = new config()

parseCommit = (commit) ->
  return unless commit? and commit

  lines     = commit.split "\n"
  commitObj =
    type:      ""
    component: ""
    message:   ""
    hash:      lines.shift()
    issues:    []
    title:     lines.shift()

  for line, i in lines when match = line.match /(?:Closes|Fixes)\s#(\d+)/
    commitObj.issues.push parseInt(match[1])
    lines.splice i, 1

  message = lines.join " "
  if match = commitObj.title.match /^([^\(]+)\(([\w\.]+)\):\s+(.+)/
    commitObj.type      = match[1]
    commitObj.component = match[2]
    commitObj.message   = match[3]
    commitObj.message  += "\n" + message if message

  if match = message.match /BREAKING CHANGE[S]?:?([\s\S]*)/
    commitObj.type    = "breaking"
    commitObj.message = match[1]

  return commitObj

lorax = module.exports = {}