// @flow

/**
 * @name printer
 * @description
 * Printing parsed data back into readable format
 */

'use strict';

import * as util from 'util';
import template from './template';

import type {Config} from './config';
import type {Commit} from './parser';

class Printer {
  commits: Array<Commit>;
  version: string;
  config: Config;
  constructor(commits: Array<Commit>, version: string, config: Config) {
    this.commits = commits;
    this.version = version;
    this.config = config;
  }

  /**
   * @description
   * Create a markdown link to issue page with issue number as text
   */
  linkToIssue(issue: string): string {
    if (!issue) return '';

    const url = this.config.get("url");
    const issueTmpl = this.config.get('issue');

    let issueLink = template.ISSUE;
    if (url && issueTmpl) {
      issueLink = util.format(template.LINK_TO_ISSUE, issue, url, issueTmpl);
    }

    return util.format(issueLink, issue);
  }


  /**
   * @function
   * @name linkToCommit
   * @description
   * Create a markdown link to commit page with commit hash as text
   */
  linkToCommit(hash: string): string {
    if (!hash) return '';

    const url = this.config.get("url");
    const commitTmpl = this.config.get("commit");

    let commitLink = template.COMMIT;
    const shortenHash = hash.substr(0, 8);
    if (url && commitTmpl) {
      commitLink = util.format(template.LINK_TO_COMMIT, shortenHash, url, commitTmpl);
    }

    return util.format(commitLink, shortenHash);
  }

  /**
   * @description
   * Using preprocessed array of commits, render a changelog in markdown format with version
   * and today's date as the header
   */
  print(options: ?Object): string {
    const lines = [];
    const sections = {};
    const display = this.config.get("display");

    options = options || {};

    // Header section
    const timestamp = options.timestamp || new Date();
    lines.push(
      util.format(template.HEADER, this.version, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate())
    );

    for (let key in display) {
      sections[key] = {};
    }

    this.commits.forEach((commit) => {
      const name = commit.component;
      const section = sections[commit.type];

      if (!section[name]) {
        section[name] = [];
      }
      section[name].push(commit);
    });

    for (let sectionType in sections) {
      const list = sections[sectionType];
      const components = Object.getOwnPropertyNames(list).sort();
      if (!components.length) {
        continue;
      }

      lines.push(util.format(template.SECTION_HEADER, display[sectionType]));

      components.forEach((componentName) => {
        const componentList = list[componentName] || [];

        const title = util.format(template.COMPONENT_TITLE, componentName);
        const hasOneItem = componentList.length == 1;
        componentList.forEach((item, index) => {
          if (!hasOneItem && !index) lines.push(title);

          let prefix = hasOneItem && !index ? title : template.COMPONENT_ITEM;
          lines.push(util.format(template.COMPONENT_LINE, prefix, item.message));

          const additionalInfo = item.issues.map((issue) => this.linkToIssue(issue));
          additionalInfo.unshift(this.linkToCommit(item.hash));

          lines.push(
            util.format(template.COMMIT_ADDITIONAL_INFO, additionalInfo.join(',\n   '))
          );
        });
      });

      lines.push('');
    }

    // Add 2 new lines
    lines.push('', '');
    return lines.join('\n');
  }
}

module.exports = Printer;

export type {Printer};
