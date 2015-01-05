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
 
var util = require("util"),
    fs = require("fs"),
    Q = require("q"),
    config = require("./lib/config"),
    git = require("./lib/git"),
    Config = new config(),
    closeRegex = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i,
    generate, get, parseCommit, write;


/**
 * @function
 * @name linkToIssue
 * @description
 * Create a markdown link to issue page with issue number as text
 * @param {String} issue Issue number
 * @returns {String} markdown text
 */

function linkToIssue(issue) {
  var issueLink, issueTmpl, url;

  if (!issue) {
    return '';
  }

  url = Config.get("url");
  issueTmpl = Config.get("issue");
  if (url && issueTmpl) {
    issueLink = "[#%s](" + url + issueTmpl + ")";
    return util.format(issueLink, issue, issue);
  } else {
    return "#" + issue;
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
  var commitLink, commitTmpl, url;

  if (!hash) {
    return '';
  }

  url = Config.get("url");
  commitTmpl = Config.get("commit");
  if (url && commitTmpl) {
    commitLink = "[%s](" + url + commitTmpl + ")";
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

parseCommit = function(commit) {
  var commitObj, i, line, lines, match, message, newLines, _len;
  if (!((commit !== undefined) && commit)) {
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
  // Get all related commits
  newLines = [];
  for (i = 0, _len = lines.length; i < _len; i++) {
    line = lines[i];
    match = line.match(closeRegex);
    if (match) {
      commitObj.issues.push(parseInt(match[1]));
    } else {
      newLines.push(line);
    }
  }
  lines = newLines;

  // Rejoin the rest of the lines after stripping out certain information
  message = lines.join("\n");

  match = commitObj.title.match(/^([^\(]+)\(([^\)]+)\):\s+(.+)/);
  if (match) {
    commitObj.type = match[1];
    commitObj.component = match[2];
    commitObj.message = match[3];
    if (message) {
      commitObj.message += "\n" + message;
    }
  }

  // Check for breaking change commit
  // Replace commit description with breaking changes
  match = message.match(/BREAKING CHANGE[S]?:?([\s\S]*)/);
  if (match) {
    commitObj.type = "breaking";
    commitObj.message = match[1];
  }

  return commitObj;
};


/**
 * @function
 * @name write
 * @description
 * Using preprocessed array of commits, generate a changelog in markdown format with version
 * and today's date as the header
 * @param {Array} commits Preprocessed array of commits
 * @param {String} version Current version
 * @returns {String} Markdown format changelog
 */

write = function(commits, version) {
  var commit, componentName, components, display, item, key, list, output, prefix, section, sectionType, sections, today, _i, _j, _k, _len, _len1, _len2, _name, _ref;
  output = "";
  sections = {};
  display = Config.get("display");

  for (key in display) {
    sections[key] = {};
  }

  for (_i = 0, _len = commits.length; _i < _len; _i++) {
    commit = commits[_i];
    section = sections[commit.type];
    if (section[_name = commit.component] === undefined) {
      section[_name] = [];
    }
    section[commit.component].push(commit);
  }

  today = new Date();
  output += "# " + version + " (" + (today.getFullYear()) + "/" + (today.getMonth() + 1) + "/" + (today.getDate()) + ")\n";
  for (sectionType in sections) {
    list = sections[sectionType];
    components = Object.getOwnPropertyNames(list).sort();
    if (!components.length) {
      continue;
    }
    output += "## " + display[sectionType] + "\n";
    for (_j = 0, _len1 = components.length; _j < _len1; _j++) {
      componentName = components[_j];
      prefix = "-";
      if (list[componentName].length > 1) {
        output += util.format("- **%s:**\n", componentName);
        prefix = "  -";
      } else {
        prefix = util.format("- **%s:**", componentName);
      }
      _ref = list[componentName];
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        item = _ref[_k];
        output += util.format("%s %s\n  (%s", prefix, item.message, linkToCommit(item.hash));
        if (item.issues.length) {
          output += ",\n   " + (item.issues.map(linkToIssue).join(", "));
        }
        output += ")\n";
      }
    }
    output += "\n";
  }
  output += "\n";
  return output;
};



/**
 * @function
 * @private
 * @name _getLog
 * @description
 * Print message and retrieve get log
 * @param {String} grep String regex to match
 * @param {String} tag  Tag to read commits from
 * @returns {Promise}   Promise with an array of commits
 */

function _getLog(grep, tag) {
  var msg = "Reading commits";
  if (tag) {
    msg += " since " + tag;
  }
  console.log(msg);
  return git.getLog(grep, tag);
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

get = function(grep, tag) {
  if (tag !== undefined) {
    return _getLog(grep, tag);
  } else {
    return git.getLastTag().then(function(lastTag) {
      return _getLog(grep, lastTag);
    });
  }
};


/**
 * @function
 * @name generate
 * @description
 * A shortcut function to get the latest tag, parse all the commits and generate the changelog
 * @param {String} toTag The latest tag
 * @param {String} file Filename to write to
 */

generate = function(toTag, file) {
  var grep = Config.get("type").join("|");

  return get(grep).then(function(commits) {
    var commit, parsedCommits, result, i;

    parsedCommits = [];
    for (i = 0; i < commits.length; i++) {
      commit = commits[i];
      if (commit) {
        parsedCommits.push(parseCommit(commit));
      }
    }

    console.log("Parsed " + parsedCommits.length + " commit(s)");
    result = write(parsedCommits, toTag);
    fs.writeFileSync(file, result, {
      encoding: "utf-8"
    });

    console.log("Generated changelog to " + file + " (" + toTag + ")");

    return;
  });
};

module.exports = {
  linkToIssue: linkToIssue,
  linkToCommit: linkToCommit,
  config: Config,
  git: git,
  get: get,
  parseCommit: parseCommit,
  write: write,
  generate: generate
};
