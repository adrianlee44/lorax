/**
 * @name config
 * @description
 * Managing lorax configuration
 */

'use strict';

const fs = require("fs");
const util = require("./util");
const findup = require('findup-sync');
const path = require('path');

class Config {
  constructor(configPath) {
    this.path = configPath || 'lorax.json';

    if (this.path && !path.isAbsolute(this.path)) {
      this.path = findup(this.path);
    }

    this.custom = fs.existsSync(this.path);
    this.jsonData = {};

    if (this.custom) {
      const rawData = fs.readFileSync(this.path, {
        encoding: 'utf-8'
      });

      try {
        this.jsonData = JSON.parse(rawData);
      } catch (e) {
        return console.error(`Invalid ${this.path}`);
      }
    }

    this.config = util.extend({}, this.default, this.jsonData);
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
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

  write(force) {
    force = force || false;

    if (this.custom || force) {
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
