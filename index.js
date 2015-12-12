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
const Q = require('q');
const util = require("util");
const Config = new config();
const closeRegex = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i;

/**
 * @function
 * @name linkToIssue
 * @description
 * Create a markdown link to issue page with issue number as text
 * @param {String} issue Issue number
 * @returns {String} markdown text
 */

function linkToIssue(issue) {
  if (!issue) {
    return '';
  }

  const url = Config.get("url");
  const issueTmpl = Config.get("issue");
  if (url && issueTmpl) {
    const issueLink = `[#%s](${url}${issueTmpl})`;
    return util.format(issueLink, issue, issue);
  } else {
    return `#${issue}`;
  }
}


/**
 * @function
 * @name linkToCommit
 * @description
 * Create a markdown link to commit page with commit hash as text
 * @param {String} hash Commit hash
 * @returns {String} markdown text
 */
function linkToCommit(hash) {
  if (!hash) {
    return '';
  }

  const url = Config.get("url");
  const commitTmpl = Config.get("commit");
  if (url && commitTmpl) {
    const commitLink = `[%s](${url}${commitTmpl})`
    return util.format(commitLink, hash.substr(0, 8), hash);
  } else {
    return hash.substr(0, 8);
  }
}


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
 * @name render
 * @description
 * Using preprocessed array of commits, render a changelog in markdown format with version
 * and today's date as the header
 * @param {Array} commits   Preprocessed array of commits
 * @param {String} version  Current version
 * @param {Object} options  Additional option
 * @returns {String} Markdown format changelog
 */
function render(commits, version, options) {
  let output = "";
  const sections = {};
  const display = Config.get("display");

  for (let key in display) {
    sections[key] = {};
  }

  commits.forEach((commit) => {
    const name = commit.component;
    const section = sections[commit.type];

    if (!section[name]) {
      section[name] = []
    }
    section[name].push(commit);
  });

  const timestamp = options.timestamp || new Date();
  output += `# ${version} (${timestamp.getFullYear()}/${timestamp.getMonth() + 1}/${timestamp.getDate()})\n`;

  for (let sectionType in sections) {
    const list = sections[sectionType];
    const components = Object.getOwnPropertyNames(list).sort();
    if (!components.length) {
      continue;
    }

    output += `## ${display[sectionType]}\n`;

    components.forEach((componentName) => {
      let prefix = '-';
      const componentList = list[componentName] || [];

      if (componentList.length > 1) {
        output += util.format("- **%s:**\n", componentName);
        prefix = "  -";
      } else {
        prefix = util.format("- **%s:**", componentName);
      }

      componentList.forEach((item) => {
        output += util.format("%s %s\n  (%s", prefix, item.message, linkToCommit(item.hash));
        if (item.issues.length) {
          output += ",\n   " + (item.issues.map(linkToIssue).join(", "));
        }
        output += ")\n";
      });
    });
    output += "\n";
  }
  output += "\n";

  return output;
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
 */

function generate(toTag, file) {
  let grep = Config.get("type").join("|");

  return get(grep)
  .then((commits) => {
    const parsedCommits = [];
    commits.forEach((commit) => {
      if (commit) {
        parsedCommits.push(parseCommit(commit));
      }
    });

    console.log("Parsed " + parsedCommits.length + " commit(s)");
    const result = write(parsedCommits, toTag);
    fs.writeFileSync(file, result, {
      encoding: "utf-8"
    });

    console.log("Generated changelog to " + file + " (" + toTag + ")");

    return;
  });
}

module.exports = {
  config: Config,
  generate: generate,
  get: get,
  linkToCommit: linkToCommit,
  linkToIssue: linkToIssue,
  parseCommit: parseCommit,
  render: render
};
