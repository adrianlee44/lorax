var Config = require("../lib/config");

exports.configTest = {
  "default test": function(test) {
    var configObj = new Config("random.json");
    test.equal(configObj.config.type.length, 4);
    test.equal(configObj.config.url, void 0);
    test.done();
  },
  "load lorax.json": function(test) {
    var configObj = new Config();
    test.equal(configObj.config.url, "https://github.com/adrianlee44/lorax");
    test.done();
  },
  "Get function": function(test) {
    var configObj = new Config();
    test.equal(configObj.get("url"), "https://github.com/adrianlee44/lorax");
    test.done();
  },
  "Set function": function(test) {
    var configObj = new Config();
    configObj.set("issue", "/issues/test/%s");
    test.equal(configObj.get("issue"), "/issues/test/%s");
    test.done();
  },
  "Custom property as true": function(test) {
    var configObj = new Config();
    test.ok(configObj.custom);
    test.done();
  },
  "Custom property as false": function(test) {
    var configObj = new Config("random.json");
    test.equal(configObj.custom, false);
    test.done();
  }
};
