/**
 * @name printer
 * @description
 * Printing parsed data back into readable format
 */

'use strict';

const util = require('util');

class Printer {
/**
 * @param {Array} commits   Preprocessed array of commits
 * @param {String} version  Current version
 * @constructor
 */
  constructor(commits, version, config) {
    this.commits = commits;
    this.version = version;
    this.config = config;
  }

  /**
   * @function
   * @name linkToIssue
   * @description
   * Create a markdown link to issue page with issue number as text
   * @param {String} issue Issue number
   * @returns {String} markdown text
   */
  linkToIssue(issue) {
    if (!issue) return '';

    const url = this.config.get("url");
    const issueTmpl = this.config.get("issue");
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
  linkToCommit(hash) {
    if (!hash) return '';

    const url = this.config.get("url");
    const commitTmpl = this.config.get("commit");
    if (url && commitTmpl) {
      const commitLink = `[%s](${url}${commitTmpl})`
      return util.format(commitLink, hash.substr(0, 8), hash);
    } else {
      return hash.substr(0, 8);
    }
  }

  /**
   * @name print
   * @description
   * Using preprocessed array of commits, render a changelog in markdown format with version
   * and today's date as the header
   * @param {Object} options  Additional option
   * @returns {String} Markdown format changelog
   */
  print(options) {
    const lines = [];
    const sections = {};
    const display = this.config.get("display");

    options = options || {};

    for (let key in display) {
      sections[key] = {};
    }

    this.commits.forEach((commit) => {
      const name = commit.component;
      const section = sections[commit.type];

      if (!section[name]) {
        section[name] = []
      }
      section[name].push(commit);
    });

    const timestamp = options.timestamp || new Date();
    lines.push(`# ${this.version} (${timestamp.getFullYear()}/${timestamp.getMonth() + 1}/${timestamp.getDate()})`);

    for (let sectionType in sections) {
      const list = sections[sectionType];
      const components = Object.getOwnPropertyNames(list).sort();
      if (!components.length) {
        continue;
      }

      lines.push(`## ${display[sectionType]}`);

      components.forEach((componentName) => {
        let prefix = '-';
        const componentList = list[componentName] || [];

        if (componentList.length > 1) {
          lines.push(util.format("- **%s:**", componentName));
          prefix = '  -';
        } else {
          prefix = util.format("- **%s:**", componentName);
        }

        componentList.forEach((item) => {
          lines.push(util.format("%s %s", prefix, item.message));

          const additionalInfo = [this.linkToCommit(item.hash)];
          if (item.issues.length) {
            additionalInfo.push.apply(additionalInfo, item.issues.map(this.linkToIssue, this));
          }

          lines.push(`  (${additionalInfo.join(',\n   ')})`);
        });
      });

      lines.push('');
    }

    return lines.join('\n');
  }
}

module.exports = Printer;
