'use strict';

import {Config} from './config';

/**
 * @name parser
 */

const closeRegex = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i;

interface Commit {
  type: string;
  component: string;
  message: string;
  hash: string;
  issues: Array<number>;
  title: string;
  processed: boolean;
}

class Parser {
  /**
   * @name parse
   * @description
   * Given a string of commits in a special format, parse string and creates an array of
   * commit objects with information
   */
  parse(commit: Nullable<string>, config: Config): Nullable<Commit> {
    if (!commit) return null;
    commit = commit.trim();
    if (commit.length === 0) return null;

    let lines = commit.split('\n') as Array<string>;

    // strip off conflict reports of merge commits:
    // also strip off sign-off lines, etc.:
    let keep = true;
    lines = lines.filter((l: string): boolean => {
      if (keep) {
        keep = !l.match(
          /^\s*(?:(?:# Conflicts:)|(?:Signed-off-by:)|(?:Co-authored-by:))/
        );
      }
      return keep;
    });
    const hash: string = lines.shift() || '';
    const allLines = lines.slice();

    const commitObj: Commit = {
      type: '',
      component: '',
      message: '',
      hash: hash,
      issues: [],
      title: lines.shift() || '',
      processed: false,
    };

    // Get all related commits
    const newLines = [] as Array<string>;
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
    let message = lines.join('\n').trim();

    // does it match conventional-changelog format:
    //   type(group): message
    const titleMatch = commitObj.title
      .trim()
      .match(
        /^(\w+)\s*(?:\(([^\r\n\s()](?:[^\r\n()]*[^\r\n\s()])?)\))?:\s+(.+)/
      );
    if (titleMatch) {
      commitObj.type = titleMatch[1];
      commitObj.component = titleMatch[2] || '?';
      commitObj.message = titleMatch[3];
      if (message) {
        commitObj.message += '\n' + message;
      }
    } else {
      // free format commit: parse in a different way
      message = allLines.join('\n').trim();

      commitObj.title = '';
      commitObj.component = '?';

      const deflist = (config.config as any).parse;
      const reCheckList = [];
      for (const key in deflist) {
        const reArr = deflist[key];
        if (Array.isArray(reArr)) {
          for (let i = 0; i < reArr.length; i++) {
            reCheckList.push({
              key,
              re: reArr[i],
            });
          }
        } else {
          reCheckList.push({
            key,
            re: reArr,
          });
        }
      }

      for (const j in reCheckList) {
        const spec = reCheckList[j];
        const re = spec.re;
        const key = spec.key;

        if (re && re.test(message)) {
          commitObj.type = key;
          commitObj.message = message;
          break; // first type discovered in commit gets the entire commit message, so Mother Of All commits MAY land in the 'wrong' section.
        } else if (!re) {
          // bundle everything that's not clearly a certain category (aka type) off into misc category:
          commitObj.type = key;
          commitObj.message = message;
          break;
        }
      }
    }

    // Check for breaking change commit
    // Replace commit description with breaking changes
    const breakingMatch = message.match(/^BREAKING CHANGE[S]?:?([\s\S]*)/);
    if (breakingMatch) {
      commitObj.type = 'breaking';
      commitObj.message = breakingMatch[1];
    }

    return commitObj;
  }
}

export {Commit, Parser};
