/**
 * @name config
 * @description
 * Managing lorax configuration
 */

import fs from 'node:fs';
import findup from 'findup-sync';
import {isAbsolute, basename} from 'node:path';

export interface DisplayConfiguration {
  [key: string]: string;
  breaking: string;
  feature: string;
  fix: string;
  refactor: string;
}

export interface Configuration {
  commit: string;
  display: DisplayConfiguration;
  issue: string;
  type: Array<string>;
  url?: string;
}

export default class Config {
  config: Configuration;
  custom: boolean;
  jsonData: Configuration | Record<string, unknown>;
  private path: string;

  static default = {
    issue: '/issues/%s',
    commit: '/commit/%s',
    type: ['^fix', '^feature', '^refactor', 'BREAKING', '^test', '^doc'],
    display: {
      fix: 'Bug Fixes',
      feature: 'Features',
      breaking: 'Breaking Changes',
      refactor: 'Optimizations',
      test: 'Testing',
      doc: 'Documentation',
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
    value?: Configuration[keyof Configuration]
  ): Configuration {
    if (typeof key === 'object') {
      this.config = {
        ...this.config,
        ...key,
      };
    } else if (typeof key === 'string') {
      this.config = {
        ...this.config,
        [key]: value,
      };
    }

    return this.config;
  }

  write(force?: boolean): string | void {
    if (this.custom || !!force) {
      const rawData = JSON.stringify(this.config, null, '  ');
      return fs.writeFileSync(this.path, rawData, {
        encoding: 'utf-8',
      });
    }
  }

  updatePath(path: string): this {
    this.path = path;
    return this;
  }

  reset(): void {
    this.config = Object.assign(
      {},
      Config.default,
      this.jsonData
    ) as Configuration;
  }
}
