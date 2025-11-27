import type Config from './config.js';

/**
 * @name parser
 */

import {
  BREAKING_CHANGE_REGEX,
  CLOSE_REGEX,
  NEW_LINE,
  TITLE_REGEX,
} from './constants.js';

export interface Commit {
  type: string;
  component: string;
  message: string;
  hash: string;
  issues: Array<number>;
  title: string;
}

export default class Parser {
  _config: Config;

  constructor(config: Config) {
    this._config = config;
  }

  /**
   * @name parse
   * @description
   * Given a string of commits in a special format, parse string and creates an array of
   * commit objects with information
   */
  parse(commit: string | null): Commit | null {
    if (!commit) return null;

    let lines = commit.split(NEW_LINE) as Array<string>;
    const commitObj: Commit = {
      type: '',
      component: '',
      message: '',
      hash: lines.shift() || '',
      issues: [],
      title: lines.shift() || '',
    };

    // Get all related commits
    const newLines = [] as Array<string>;
    lines.forEach((line) => {
      const match = line.match(CLOSE_REGEX);
      if (match) {
        commitObj.issues.push(parseInt(match[1]));
      } else {
        newLines.push(line);
      }
    });
    lines = newLines;

    // Rejoin the rest of the lines after stripping out certain information
    const message = lines.join(NEW_LINE);

    const titleMatch = commitObj.title.match(TITLE_REGEX);
    if (titleMatch) {
      commitObj.type = this._config.getTypeByInput(titleMatch[1]);
      commitObj.component = titleMatch[2];
      commitObj.message = titleMatch[3];
      if (message) {
        commitObj.message += NEW_LINE + message;
      }
    }

    // Check for breaking change commit
    // Replace commit description with breaking changes
    const breakingMatch = message.match(BREAKING_CHANGE_REGEX);
    if (breakingMatch) {
      commitObj.type = 'breaking';
      commitObj.message = breakingMatch[1];
    }

    return commitObj;
  }
}
