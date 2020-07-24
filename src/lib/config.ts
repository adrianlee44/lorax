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
  [key: string]: string | boolean | null;
  breaking: string | boolean | null;
  feature: string | boolean | null;
  fix: string | boolean | null;
  refactor: string | boolean | null;
  doc: string | boolean | null;
  test: string | boolean | null;
  misc: string | boolean | null;
}

interface ParseConfiguration {
  [key: string]: RegExp | Array<RegExp> | null;
  breaking: RegExp | Array<RegExp>;
  feature: RegExp | Array<RegExp>;
  fix: RegExp | Array<RegExp>;
  refactor: RegExp | Array<RegExp>;
  doc: RegExp | Array<RegExp>;
  test: RegExp | Array<RegExp>;
  misc: RegExp | Array<RegExp> | null;
}

interface Configuration {
  commit: string;
  display: DisplayConfiguration;
  parse: ParseConfiguration;
  issue: string;
  url?: string;
}

function strToRe(str: string | null): RegExp | null {
  if (!str) return null;
  const m = /^\/(.+)\/([a-z]*)$/.exec(str);
  if (!m) return null;
  const re = RegExp(m[1], m[2]);
  return re;
}

function extractProjectBaseUriFromPackageJson(): string | null {
  // load repository URL from package.json
  const packagePath = findup('package.json') || '';

  try {
    if (fs.existsSync(packagePath)) {
      const rawData: string = fs.readFileSync(packagePath, {
        encoding: 'utf-8',
      });

      let url;
      const jsonData = JSON.parse(rawData);
      if (typeof jsonData.repository === 'string') {
        url = 'https://github.com/' + jsonData.repository;
      } else if (typeof jsonData.bugs?.url === 'string') {
        url = jsonData.bugs.url;
        url = url.replace(/[/\\]issues.*$/, '');
      } else if (typeof jsonData.repository?.url === 'string') {
        url = jsonData.repository.url;
        if (url) {
          url = url
            .replace(/\.git$/, '')
            .replace(/^git@github\.com:/, 'https://github.com/');
        }
      }
      return url;
    }
  } catch (e) {
    console.error(`Invalid ${basename(packagePath)}`);
  }
  return null;
}

class Config {
  config: Configuration;
  custom: boolean;
  jsonData: Configuration | any;
  readonly path: string;

  static default: Configuration = {
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
      refactor: [/\brefactor\w*/i, /\bredesign\w*/i],
      doc: [/\bdoc\w*/i, /\bREADME/],
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
      breaking: 'Breaking Changes',
      feature: 'Features',
      fix: 'Bug Fixes',
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

        this.jsonData = JSON.parse(rawData, (key, value) => {
          if (key === 'parse') {
            const rv: {[key: string]: RegExp | Array<RegExp> | null} = {};
            for (const k in value) {
              const re = value[k];
              if (Array.isArray(re)) {
                const a: Array<RegExp> = [];
                for (let i = 0; i < re.length; i++) {
                  const r2 = re[i];
                  a[i] = strToRe(r2) as RegExp;
                }
                rv[k] = a;
              } else if (re) {
                rv[k] = strToRe(re);
              } else {
                rv[k] = null;
              }
            }
            return rv;
          }
          return value;
        });
      } catch (e) {
        console.error(`Invalid ${basename(this.path)}`);
      }
    }

    this.config = Object.assign(
      {},
      Config.default,
      this.jsonData
    ) as Configuration;

    // TODO: support forked repositories where bugs are filed in the main repo or other website than the commit diff view pages.

    if (!this.config.url) {
      const url = extractProjectBaseUriFromPackageJson();

      if (url) {
        console.info(`project URL inferred from package.json:\n\n  ${url}\n\n`);
        this.config.url = url;
      }
    }

    /* eslint no-constant-condition: 0 */
    //
    // edit condition to `true` when you want to regenerate
    // the default/complete lorax.json file for documentation or verification purposes
    if (false) {
      console.log(`write ${this.path}`);
      this.write(true);
    }
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
      const rawData = JSON.stringify(
        this.config,
        (key, value) => {
          if (key === 'parse') {
            const rv: {[key: string]: string | Array<string> | null} = {};
            for (const k in value) {
              const re = value[k];
              if (Array.isArray(re)) {
                const a: Array<string> = [];
                for (let i = 0; i < re.length; i++) {
                  const r2 = re[i];
                  a[i] = r2.toString();
                }
                rv[k] = a;
              } else if (re) {
                rv[k] = re.toString();
              } else {
                rv[k] = null;
              }
            }
            return rv;
          }
          return value;
        },
        2
      );
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

    if (!this.config.url) {
      const url = extractProjectBaseUriFromPackageJson();

      if (url) {
        console.info(`project URL inferred from package.json:\n\n  ${url}\n\n`);
        this.config.url = url;
      }
    }
  }
}

export {Config, Configuration, DisplayConfiguration};
