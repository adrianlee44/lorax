// @flow

/**
 * @name parser
 */

'use strict';

const closeRegex = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i;

type Commit = {
  type: string,
  component: string,
  message: string,
  hash: string,
  issues: Array<number>,
  title: string
}

class Parser {
  /**
   * @name parse
   * @description
   * Given a string of commits in a special format, parse string and creates an array of
   * commit objects with information
   */
  parse(commit: string): ?Commit {
    if (!commit) return;

    let lines = commit.split("\n");
    const commitObj: Commit = {
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

    const titleMatch = commitObj.title.match(/^([^\(]+)(?:\(([^\)]+)\))?:\s+(.+)/);
    if (titleMatch) {
      commitObj.type = titleMatch[1];
      commitObj.component = titleMatch[2];
      commitObj.message = titleMatch[3];
      if (message) {
        commitObj.message += "\n" + message;
      }
      if (commitObj.component === undefined) {
        commitObj.component = '';
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
}

module.exports = Parser;

export type {Parser, Commit};
