'use strict';

/**
 * @name config
 * @description
 * Managing lorax configuration
 */

import * as fs from 'fs';
import findup from 'findup-sync';
import {isAbsolute, basename} from 'path';

interface DisplayConfiguration {
  [key: string]: string;
  breaking: string;
  feature: string;
  fix: string;
  refactor: string;
}

interface Configuration {
  commit: string;
  display: DisplayConfiguration;
  issue: string;
  type: Array<string>;
  url?: string;
}

class Config {
  config: Configuration;
  custom: boolean;
  jsonData: Configuration | any;
  readonly path: string;

  static default = {
    issue: '/issues/%s',
    commit: '/commit/%s',
    parse: {
      // specify these keys in order of decreasing importance!
      breaking: /\bBREAKING\b/,
      feature: [
        /\bfeature\w*/i,
        /\badd(?:ed|ing)?\s+support\b/i,
        /\baugmented\b/i,
        /\b(?:is|was|(?:has been)) implemented\b/i,
      ],
      fix: /\bfix\w*/i,
      refactor: [
        /\brefactor\w*/i,
        /\bredesign\w*/i,
      ],
      doc: [
        /\bdoc\w*/i,
        /\bREADME/,
      ],
      test: /\btest\w*/i,
      chore: [
        /bump build (?:revision|version)/i,
        /updated npm packages/i,
        /regenerate .*files/i,
        /lint fixes/i,
        /Merge .* branch/i,
        /Merge tag/i,
        /(?:es)?lint/i,
      ],
      misc: null,
    },
    display: {
      fix: 'Bug Fixes',
      feature: 'Features',
      breaking: 'Breaking Changes',
      refactor: 'Optimizations',
      test: 'Testing',
      doc: 'Documentation',
      misc: 'Miscellaneous',
    },
  };

  constructor(configPath = 'lorax.json') {
    this.path = configPath;
    this.jsonData = {};

    if (!isAbsolute(this.path)) {
      this.path = findup(this.path) || '';
    }

    this.custom = fs.existsSync(this.path);

    if (this.custom) {
      try {
        const rawData: string = fs.readFileSync(this.path, {
          encoding: 'utf-8',
        });

        this.jsonData = JSON.parse(rawData);
      } catch (e) {
        console.error(`Invalid ${basename(this.path)}`);
      }
    }

    this.config = Object.assign(
      {},
      Config.default,
      this.jsonData
    ) as Configuration;
  }

  get<K extends keyof Configuration>(key: K): Configuration[K] {
    return this.config[key];
  }

  set<K extends keyof Configuration | Partial<Configuration>>(
    key: K,
    value?: any
  ): Configuration {
    if (typeof key === 'object') {
      for (const hashKey in key) {
        this.set(hashKey as keyof Configuration, key[hashKey]);
      }
    } else {
      this.config[key as keyof Configuration] = value;
    }

    return this.config;
  }

  write(force: boolean): string | void {
    if (this.custom || !!force) {
      const rawData = JSON.stringify(this.config, null, '  ');
      return fs.writeFileSync(this.path, rawData, {
        encoding: 'utf-8',
      });
    }
  }

  reset(): void {
    this.config = Object.assign(
      {},
      Config.default,
      this.jsonData
    ) as Configuration;
  }
}

export {Config, Configuration, DisplayConfiguration};
