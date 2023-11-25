/**
 * @name config
 * @description
 * Managing lorax configuration
 */

import fs from 'node:fs';
import findup from 'findup-sync';
import {isAbsolute, basename} from 'node:path';

export interface Configuration {
  version: number;
  commit: string;
  issue: string;
  types: {
    [key: string]: {
      title: string;
      regex: string;
    };
  };
  url?: string;
}

export default class Config {
  config: Configuration;
  custom: boolean;
  jsonData: Configuration | Record<string, unknown>;
  private path: string;

  static VERSION = 2;

  static default = {
    version: Config.VERSION,
    issue: '/issues/%s',
    commit: '/commit/%s',
    types: {
      fix: {
        title: 'Bug Fixes',
        regex: '^fix',
      },
      feature: {
        title: 'Features',
        regex: '^feature',
      },
      breaking: {
        title: 'Breaking Changes',
        regex: 'BREAKING',
      },
      refactor: {
        title: 'Optimizations',
        regex: '^refactor',
      },
      test: {
        title: 'Testing',
        regex: '^test',
      },
      doc: {
        title: 'Documentation',
        regex: '^doc',
      },
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

        const parsedRawData = JSON.parse(rawData);

        if (parsedRawData.version !== Config.VERSION) {
          console.error(
            `Invalid version of ${basename(
              this.path
            )}. Please update to version ${Config.VERSION}`
          );
          this.jsonData = {};
        } else {
          this.jsonData = parsedRawData;
        }
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
