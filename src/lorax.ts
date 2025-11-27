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
 */

import fs from 'node:fs';
import Config from './lib/config';
import {getLastTag, getLog} from './lib/git';
import Printer from './lib/printer';
import Parser from './lib/parser';

import type {Commit} from './lib/parser';

export interface LoraxOptions {
  since?: string;
  prepend?: boolean;
  timestamp?: Date;
}

export default class Lorax {
  _config: Config;
  _parser: Parser;

  constructor() {
    this._config = new Config();
    this._parser = new Parser(this._config);
  }

  /**
   * @description
   * Get all commits or commits since last tag
   */
  async get(grep: string, tag?: string): Promise<Array<string>> {
    try {
      tag = tag ? tag : await getLastTag();
      let msg = 'Reading commits';
      if (tag) {
        msg += ' since ' + tag;
      }
      console.log(msg);
      return await getLog({grep, tag});
    } catch (error) {
      console.error('Unable to retrieve commits');
      throw error;
    }
  }

  /**
   * @description
   * A shortcut function to get the latest tag, parse all the commits and generate the changelog
   */
  async generate(
    toTag: string,
    file: string,
    options: LoraxOptions
  ): Promise<void> {
    const types = Object.values(this._config.get('types'));
    const grep = types.map((type) => type.regex).join('|');
    const commits = await this.get(grep, options.since);

    const parsedCommits: Array<Commit> = [];
    commits.forEach((commit: string) => {
      const parsedCommit = this._parser.parse(commit);

      if (parsedCommit) {
        parsedCommits.push(parsedCommit);
      }
    });

    console.log(`Parsed ${parsedCommits.length} commit(s)`);
    const printer = new Printer(parsedCommits, toTag, this._config);
    let result = printer.print();

    if (options.prepend) {
      const existingData = fs.readFileSync(file, {
        encoding: 'utf-8',
      });

      result += existingData;
    }

    fs.writeFileSync(file, result, {flag: 'w'});

    console.log(`Generated changelog to ${file} (${toTag})`);
    return;
  }
}
