/**
 * @name Lorax
 *
 * @description
 * A node module which reads the git log and create a human readable changelog
 *
 * @author Adrian Lee
 * @url https://github.com/adrianlee44/lorax
 * @license MIT
 *
 * @dependencies
 * - commander
 * - q
 */
'use strict';

const config = require("./lib/config");
const fs = require("fs");
const git = require("./lib/git");
const Printer = require("./lib/printer");
const Q = require('q');
const Config = new config();
const closeRegex = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i;

/**
 * @function
 * @name parseCommit
 * @description
 * Given a string of commits in a special format, parse string and creates an array of
 * commit objects with information
 * @param {String} commit Commit string
 * @returns {Array} Array of commit objects
 */
function parseCommit(commit) {
  if (!commit) return;

  let lines = commit.split("\n");
  const commitObj = {
    type: "",
    component: "",
    message: "",
    hash: lines.shift(),
    issues: [],
    title: lines.shift()
  };

  // Get all related commits
  const newLines = [];
  lines.forEach((line) => {
    const match = line.match(closeRegex);
    if (match) {
      commitObj.issues.push(parseInt(match[1]));
    } else {
      newLines.push(line);
    }
  });
  lines = newLines;

  // Rejoin the rest of the lines after stripping out certain information
  const message = lines.join("\n");

  const titleMatch = commitObj.title.match(/^([^\(]+)\(([^\)]+)\):\s+(.+)/);
  if (titleMatch) {
    commitObj.type = titleMatch[1];
    commitObj.component = titleMatch[2];
    commitObj.message = titleMatch[3];
    if (message) {
      commitObj.message += "\n" + message;
    }
  }

  // Check for breaking change commit
  // Replace commit description with breaking changes
  const breakingMatch = message.match(/BREAKING CHANGE[S]?:?([\s\S]*)/);
  if (breakingMatch) {
    commitObj.type = "breaking";
    commitObj.message = breakingMatch[1];
  }

  return commitObj;
}

/**
 * @function
 * @name get
 * @description
 * Get all commits or commits since last tag
 * @param {String} grep  String regex to match
 * @param {String} tag   Tag to read commits from
 * @returns {Promise} Promise with an array of commits
 */
function get(grep, tag) {
  const promise = tag ? Q(tag) : git.getLastTag();
  return promise
  .then((tag) => {
    let msg = "Reading commits";
    if (tag) {
      msg += " since " + tag;
    }
    console.log(msg);
    return git.getLog(grep, tag);
  });
}

/**
 * @function
 * @name generate
 * @description
 * A shortcut function to get the latest tag, parse all the commits and generate the changelog
 * @param {String} toTag The latest tag
 * @param {String} file Filename to write to
 * @param {Object} options
 */

function generate(toTag, file, options) {
  let grep = Config.get("type").join("|");

  return get(grep, options.since)
  .then((commits) => {
    const parsedCommits = [];
    commits.forEach((commit) => {
      if (commit) {
        parsedCommits.push(parseCommit(commit));
      }
    });

    console.log("Parsed " + parsedCommits.length + " commit(s)");
    const printer = new Printer(parsedCommits, toTag, Config);
    const result = printer.print();
    fs.writeFileSync(file, result, {
      encoding: "utf-8"
    });

    console.log("Generated changelog to " + file + " (" + toTag + ")");

    return;
  });
}

module.exports = {
  generate: generate,
  get: get,
  parseCommit: parseCommit
};
