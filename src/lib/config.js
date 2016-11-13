// @flow

/**
 * @name config
 * @description
 * Managing lorax configuration
 */

'use strict';

import * as fs from 'fs';
import * as util from './util';
import findup from 'findup-sync';
import * as path from 'path';

class Config {
  path: string;
  custom: boolean;
  jsonData: Object;
  config: Object;
  default: Object;
  constructor(configPath: ?string) {
    this.path = configPath || 'lorax.json';

    if (this.path && !path.isAbsolute(this.path)) {
      this.path = findup(this.path);
    }

    this.custom = fs.existsSync(this.path);

    if (this.custom) {
      try {
        const rawData = fs.readFileSync(this.path, {
          encoding: 'utf-8'
        });

        this.jsonData = JSON.parse(rawData);
      } catch (e) {
        return console.error(`Invalid ${path.basename(this.path)}`);
      }
    }

    this.config = util.extend({}, this.default, this.jsonData);
  }

  get(key: string): any {
    return this.config[key];
  }

  set(key: string, value: any): any {
    if (typeof key === "object") {
      for (let hashKey in key) {
        const hashValue = key[hashKey];
        if (this.config[hashKey] !== undefined) {
          this.config[hashKey] = hashValue;
        }
      }
    } else {
      this.config[key] = value;
    }

    return value;
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
    this.config = util.extend({}, this.default, this.jsonData);
  }
}

Config.prototype.default = {
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

module.exports = Config;

export type {Config};
