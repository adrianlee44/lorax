/**
 * @name printer
 * @description
 * Printing parsed data back into readable format
 */

import util from 'node:util';
import {template} from './template.js';

import Config from './config.js';
import {NEW_LINE} from './constants.js';

import type {Configuration} from './config.js';
import type {Commit} from './parser.js';
import type {LoraxOptions} from '../lorax.js';

type PrintSection = {
  [P in string]: {
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
   * Render a single commit as a formatted line plus its additional info
   * (commit link and issue links) into the given lines array
   */
  private printCommitLine(
    lines: Array<string>,
    prefix: string,
    item: Commit
  ): void {
    lines.push(util.format(template.COMPONENT_LINE, prefix, item.message));

    const additionalInfo = item.issues.map((issue) => this.linkToIssue(issue));
    additionalInfo.unshift(this.linkToCommit(item.hash));

    lines.push(
      util.format(
        template.COMMIT_ADDITIONAL_INFO,
        additionalInfo.join(`,${NEW_LINE}   `)
      )
    );
  }

  /**
   * @description
   * Using preprocessed array of commits, render a changelog in markdown format with version
   * and today's date as the header
   */
  print(options?: LoraxOptions): string {
    const lines: Array<string> = [];
    const sections = {} as PrintSection;
    const types = this.config.get('types');

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

    for (const key in types) {
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

      lines.push(
        util.format(template.SECTION_HEADER, types[sectionType].title)
      );

      components.forEach((componentName: string) => {
        const componentList = list[componentName] || [];

        if (!componentName) {
          componentList.forEach((item) => {
            this.printCommitLine(lines, template.GENERIC_ITEM, item);
          });
          return;
        }

        const title = util.format(template.COMPONENT_TITLE, componentName);
        const hasOneItem = componentList.length == 1;
        componentList.forEach((item, index) => {
          if (!hasOneItem && !index) lines.push(title);

          const prefix = hasOneItem && !index ? title : template.COMPONENT_ITEM;
          this.printCommitLine(lines, prefix, item);
        });
      });

      lines.push('');
    }

    // Add 2 new lines
    lines.push('', '');
    return lines.join(NEW_LINE);
  }
}
