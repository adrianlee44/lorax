/**
 * @name config
 * @description
 * Managing lorax configuration
 */

import fs from 'node:fs';
import {basename, resolve} from 'node:path';
import {findUp} from './find-up.js';
import {DEFAULT_CONFIG_NAME} from './constants.js';

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
        regex: '^feat(ure)?',
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

  /**
   * @param configPath Config file name or path. When null, or when it is only
   * a file name, parent directories are searched for the file (lorax.json by
   * default). Anything more than a file name is treated as a path (relative to
   * the current directory, or absolute) and is not searched for. Throws if a
   * configPath is given and does not resolve to an existing file.
   */
  constructor(configPath: string | null = null) {
    this.jsonData = {};

    if (configPath === null) {
      this.path = findUp(DEFAULT_CONFIG_NAME) ?? '';
    } else if (basename(configPath) === configPath) {
      this.path = findUp(configPath) ?? '';
    } else {
      this.path = resolve(configPath);
    }

    this.custom = fs.existsSync(this.path);

    if (configPath !== null && !this.custom) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

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
      } catch (_) {
        console.error(`Invalid ${basename(this.path)}`);
      }
    }

    this.config = Object.assign(
      {},
      Config.default,
      this.jsonData
    ) as Configuration;
  }

  getTypeByInput(input: string): string {
    const types = this.config.types;
    for (const [key, value] of Object.entries(types)) {
      const regex = new RegExp(value.regex, 'i');
      if (regex.test(input)) {
        return key;
      }
    }
    return '';
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
