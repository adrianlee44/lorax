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
const Parser = require('./lib/parser');
const Q = require('q');
const Config = new config();

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
  const parser = new Parser();

  return get(grep, options.since)
  .then((commits) => {
    const parsedCommits = [];
    commits.forEach((commit) => {
      if (commit) {
        parsedCommits.push(parser.parse(commit));
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

module.exports = {generate, get};
