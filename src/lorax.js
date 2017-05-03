// @flow

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

import Config from './lib/config';
import * as fs from 'fs';
import * as git from './lib/git';
import Printer from './lib/printer';
import Parser from './lib/parser';
import Q from 'q';

import type {Commit} from './lib/parser';

class Lorax {
  _config: Config;
  _parser: Parser;

  constructor() {
    this._config = new Config();
    this._parser = new Parser();
  }

  /**
   * @description
   * Get all commits or commits since last tag
   */
  get(grep: string, tag?: string): Promise<Array<string>> {
    const promise = tag ? Q.resolve(tag) : git.getLastTag();
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
   * @description
   * A shortcut function to get the latest tag, parse all the commits and generate the changelog
   */

  generate(toTag: string, file: string, options: Object) {
    let grep = this._config.get("type").join("|");

    return this.get(grep, options.since)
    .then((commits: Array<string>) => {
      const parsedCommits: Array<Commit> = [];
      commits.forEach((commit: string) => {
        let parsedCommit = this._parser.parse(commit);

        if (parsedCommit) {
          parsedCommits.push(parsedCommit);
        }
      });

      console.log(`Parsed ${parsedCommits.length} commit(s)`);
      const printer = new Printer(parsedCommits, toTag, this._config);
      let result = printer.print();

      if (options.prepend) {
        let existingData = fs.readFileSync(file, {
          encoding: 'utf-8'
        });

        result += existingData;
      }

      fs.writeFileSync(file, result, {flag: 'w'});

      console.log(`Generated changelog to ${file} (${toTag})`);
      return;
    });
  }
}

module.exports = new Lorax();
