// @flow

/**
 * @name config
 * @description
 * Managing lorax configuration
 */

'use strict';

import * as fs from 'fs';
import {extend} from './util';
import findup from 'findup-sync';
import {isAbsolute, basename} from 'path';

type DisplayConfiguration = {
  [string]: string,
  breaking: string,
  feature: string,
  fix: string,
  refactor: string
}

type Configuration = {
  commit: string,
  display: DisplayConfiguration,
  issue: string,
  type: Array<string>,
  url?: string,
}

export default class Config {
  config: Configuration;
  custom: boolean;
  jsonData: Configuration;
  path: string;
  static default: Configuration;

  constructor(configPath: ?string) {
    this.path = configPath || 'lorax.json';

    if (this.path && !isAbsolute(this.path)) {
      this.path = findup(this.path);
    }

    this.custom = fs.existsSync(this.path);

    if (this.custom) {
      try {
        const rawData: string = fs.readFileSync(this.path, {
          encoding: 'utf-8'
        });

        this.jsonData = JSON.parse(rawData);
      } catch (e) {
        return console.error(`Invalid ${basename(this.path)}`);
      }
    }

    this.config = extend({}, Config.default, this.jsonData);
  }

  get<K: $Keys<Configuration>>(key: K): any {
    return (this.config[key]: any);
  }

  set<K: $Keys<Configuration> | Object, V: $Values<Configuration>>(key: K, value: V): Configuration {
    if (typeof key === "object") {
      for (let hashKey in key) {
        this.set(hashKey, key[hashKey]);
      }
    } else {
      this.config[key] = (value: any);
    }
  
    return this.config;
  }
  
  write(force: boolean) {
    if (this.custom || !!force) {
      const rawData = JSON.stringify(this.config, null, '  ');
      return fs.writeFileSync(this.path, rawData, {
        encoding: 'utf-8'
      });
    }
  }

  reset() {
    this.config = extend({}, Config.default, this.jsonData);
  }
}

Config.default = {
  issue: "/issues/%s",
  commit: "/commit/%s",
  type: ["^fix", "^feature", "^refactor", "BREAKING"],
  display: {
    fix: "Bug Fixes",
      feature: "Features",
      breaking: "Breaking Changes",
      refactor: "Optimizations"
    }
  };
  
export type {Config, Configuration, DisplayConfiguration };
