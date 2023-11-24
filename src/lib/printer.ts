/**
 * @name printer
 * @description
 * Printing parsed data back into readable format
 */

import util from 'node:util';
import {template} from './template.js';

import Config from './config.js';
import {NEW_LINE} from './constants.js';

import type {Configuration, DisplayConfiguration} from './config.js';
import type {Commit} from './parser.js';
import type {LoraxOptions} from '../lorax.js';

type PrintSection = {
  [P in keyof DisplayConfiguration]: {
    [component: string]: Array<Commit>;
  };
};

export default class Printer {
  private commits: Array<Commit>;
  private version: string;
  private config: Config;

  constructor(commits: Array<Commit>, version: string, config: Config) {
    this.commits = commits;
    this.version = version;
    this.config = config;
  }

  /**
   * @description
   * Create a markdown link to issue page with issue number as text
   */
  linkToIssue(issue?: number): string {
    if (!issue) return '';

    const url: Configuration['url'] = this.config.get('url');
    const issueTmpl: Configuration['issue'] = this.config.get('issue');

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
  linkToCommit(hash?: string): string {
    if (!hash) return '';

    const url = this.config.get('url');
    const commitTmpl = this.config.get('commit');

    let commitLink = template.COMMIT;
    const shortenHash = hash.substring(0, 8);
    if (url && commitTmpl) {
      commitLink = util.format(
        template.LINK_TO_COMMIT,
        shortenHash,
        url,
        commitTmpl
      );
    }

    return util.format(commitLink, shortenHash);
  }

  /**
   * @description
   * Using preprocessed array of commits, render a changelog in markdown format with version
   * and today's date as the header
   */
  print(options?: LoraxOptions): string {
    const lines: Array<string> = [];
    const sections = {} as PrintSection;
    const display = this.config.get('display');

    options = options || {};

    // Header section
    const timestamp = options.timestamp || new Date();
    lines.push(
      util.format(
        template.HEADER,
        this.version,
        timestamp.getFullYear(),
        timestamp.getMonth() + 1,
        timestamp.getDate()
      )
    );

    for (const key in display) {
      sections[key] = {};
    }

    this.commits.forEach((commit: Commit) => {
      const {component, type} = commit;

      const section = sections[type];
      if (!section[component]) {
        section[component] = [];
      }
      section[component].push(commit);
    });

    for (const sectionType in sections) {
      const list = sections[sectionType];
      const components = Object.getOwnPropertyNames(list).sort();
      if (!components.length) {
        continue;
      }

      lines.push(util.format(template.SECTION_HEADER, display[sectionType]));

      components.forEach((componentName: string) => {
        const componentList = list[componentName] || [];

        const title = util.format(template.COMPONENT_TITLE, componentName);
        const hasOneItem = componentList.length == 1;
        componentList.forEach((item, index) => {
          if (!hasOneItem && !index) lines.push(title);

          const prefix = hasOneItem && !index ? title : template.COMPONENT_ITEM;
          lines.push(
            util.format(template.COMPONENT_LINE, prefix, item.message)
          );

          const additionalInfo = item.issues.map((issue) =>
            this.linkToIssue(issue)
          );
          additionalInfo.unshift(this.linkToCommit(item.hash));

          lines.push(
            util.format(
              template.COMMIT_ADDITIONAL_INFO,
              additionalInfo.join(`,${NEW_LINE}   `)
            )
          );
        });
      });

      lines.push('');
    }

    // Add 2 new lines
    lines.push('', '');
    return lines.join(NEW_LINE);
  }
}
