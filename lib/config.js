var Config, fs, util;

fs = require("fs");

util = require("./util");

Config = (function() {
  Config.prototype["default"] = {
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

  function Config() {
    var e, jsonData, rawData;
    if (this.custom = fs.existsSync("lorax.json")) {
      rawData = fs.readFileSync("lorax.json", {
        encoding: "utf-8"
      });
      try {
        jsonData = JSON.parse(rawData);
      } catch (_error) {
        e = _error;
        return console.log("Invalid lorax.json");
      }
      this.config = util.extend({}, this["default"], jsonData);
    } else {
      this.config = util.extend({}, this["default"]);
    }
  }

  Config.prototype.get = function(key) {
    return this.config[key];
  };

  Config.prototype.set = function(key, value) {
    return this.config[key] = value;
  };

  Config.prototype.write = function(force) {
    var rawData;
    if (force == null) {
      force = false;
    }
    if (this.custom || force) {
      rawData = JSON.stringify(this.config, null, "  ");
      return fs.writeFileSync("lorax.json", rawData, {
        encoding: "utf-8"
      });
    }
  };

  return Config;

})();

module.exports = Config;
