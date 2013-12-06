/*
@name Lorax

@description
A node module which reads the git log and create a human readable changelog

@author Adrian Lee
@url https://github.com/adrianlee44/lorax
@license MIT

@dependencies
- commander
*/

var Config, GIT_GREP, config, fs, git, lorax, parseCommit, path, pkg, util;

util = require("util");

fs = require("fs");

path = require("path");

pkg = require(path.join(__dirname, "package.json"));

config = require("./lib/config");

git = require("./lib/git");

GIT_GREP = "";

Config = new config();

parseCommit = function(commit) {
  var commitObj, i, line, lines, match, message, _i, _len;
  if (!((commit != null) && commit)) {
    return;
  }
  lines = commit.split("\n");
  commitObj = {
    type: "",
    component: "",
    message: "",
    hash: lines.shift(),
    issues: [],
    title: lines.shift()
  };
  for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
    line = lines[i];
    if (!(match = line.match(/(?:Closes|Fixes)\s#(\d+)/))) {
      continue;
    }
    commitObj.issues.push(parseInt(match[1]));
    lines.splice(i, 1);
  }
  message = lines.join(" ");
  if (match = commitObj.title.match(/^([^\(]+)\(([\w\.]+)\):\s+(.+)/)) {
    commitObj.type = match[1];
    commitObj.component = match[2];
    commitObj.message = match[3];
    if (message) {
      commitObj.message += "\n" + message;
    }
  }
  if (match = message.match(/BREAKING CHANGE[S]?:?([\s\S]*)/)) {
    commitObj.type = "breaking";
    commitObj.message = match[1];
  }
  return commitObj;
};

lorax = module.exports = {};
