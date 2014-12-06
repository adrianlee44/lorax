var fs = require("fs"),
    util = require("./util");

function Config(path) {
  var e, jsonData, rawData;
  this.path = path !== undefined ? path : "lorax.json";
  this.custom = fs.existsSync(this.path);
  if (this.custom) {
    rawData = fs.readFileSync(this.path, {
      encoding: "utf-8"
    });
    try {
      jsonData = JSON.parse(rawData);
    } catch (_error) {
      e = _error;
      return console.log("Invalid " + path);
    }
    this.config = util.extend({}, this.default, jsonData);
  } else {
    this.config = util.extend({}, this.default);
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

Config.prototype.get = function(key) {
  return this.config[key];
};

Config.prototype.set = function(key, value) {
  var hashKey, hashValue;
  if (typeof key === "object") {
    for (hashKey in key) {
      hashValue = key[hashKey];
      if (this.config[hashKey] !== undefined) {
        this.config[hashKey] = hashValue;
      }
    }
  } else {
    this.config[key] = value;
  }
};

Config.prototype.write = function(force) {
  var rawData;
  if (force === undefined) {
    force = false;
  }
  if (this.custom || force) {
    rawData = JSON.stringify(this.config, null, "  ");
    return fs.writeFileSync("lorax.json", rawData, {
      encoding: "utf-8"
    });
  }
};

module.exports = Config;
