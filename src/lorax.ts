'use strict';

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

import {Config} from './lib/config';
import * as fs from 'fs';
import * as git from './lib/git';
import {Printer} from './lib/printer';
import {Parser} from './lib/parser';

import type {Commit} from './lib/parser';

export interface LoraxOptions {
  since?: string;
  all?: boolean;
  prepend?: boolean;
  timestamp?: Date;
}

export class Lorax {
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
  get(options: LoraxOptions): Promise<Array<string>> {
    const tag = options.since;
    const all = options.all;
    const promise = all
      ? Promise.resolve<string>('*')
      : tag
      ? Promise.resolve<string>(tag)
      : git.getLastTag();
    return promise
      .then(
        (tag: string): Promise<Array<string>> => {
          let msg;
          if (all) {
            msg = 'Reading all commits';
          } else {
            msg = 'Reading commits';
            if (tag) {
              msg += ' since ' + tag;
            }
          }
          console.log(msg);
          return git.getLog(all ? null : tag);
        }
      )
      .catch((error) => {
        throw error;
      });
  }

  /**
   * @description
   * A shortcut function to get the latest tag, parse all the commits and generate the changelog
   */
  generate(toTag: string, file: string, options: LoraxOptions): Promise<void> {
    const all = options.all;
    /* eslint-disable @typescript-eslint/no-this-alias */
    const self = this;

    if (!all) {
      return this.get(options)
        .then((commits: Array<string>): void => {
          this.__processCommits(toTag, file, options, commits);
          return;
        })
        .catch((error) => {
          console.error('Failure during changelog generation:', error);
        });
    } else {
      const promise = git.getAllTags();
      return promise
        .then((tags: Array<string>): void => {
          const untilTag: Nullable<string> = tags.pop() || null;
          const prevTag: Nullable<string> = null;

          function oneRound(
            prevTag: Nullable<string>,
            untilTag: Nullable<string>
          ): void {
            git
              .getLog(prevTag, untilTag)
              .then((commits: Array<string>): void => {
                self.__processCommits(
                  untilTag || toTag,
                  file,
                  options,
                  commits
                );

                if (tags.length === 0 && !untilTag) {
                  return;
                }
                prevTag = untilTag;
                untilTag = tags.pop() || null;

                options.prepend = true;

                oneRound(prevTag, untilTag);
              })
              .catch((error) => {
                console.error('Failure during changelog generation:', error);
              });
          }

          oneRound(prevTag, untilTag);
        })
        .catch((error) => {
          console.error('Failure during changelog generation:', error);
        });
    }
  }

  __processCommits(
    toTag: string,
    file: string,
    options: LoraxOptions,
    commits: Array<string>
  ): void {
    const parsedCommits: Array<Commit> = [];
    commits.forEach((commit: string) => {
      const parsedCommit = this._parser.parse(commit, this._config);

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
